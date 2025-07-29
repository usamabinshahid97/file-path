// Problem Statement (Expanded):
// You are given an array of strings representing file and folder paths. Your task is to write a function in JavaScript that:
// Requirements:
//  1️⃣ Converts the flat list of paths into a nested object structure representing a directory tree.
//  2️⃣ Sorts both folders and files alphabetically within each directory.
//  3️⃣ Ignore duplicate paths.
//  4️⃣ Correctly handles empty directories.
//  5️⃣ Supports paths with mixed file separators (/ and \).
//  6️⃣ Handles trailing slashes consistently (folder/ vs folder).
//  7️⃣ Files should have null values.
//  8️⃣ Directories should be objects.

// Input Example:

// const files = [
//     "root/folderA/file1.txt",
//     "root/folderB/file2.txt",
//     "root/folderA/file3.txt",
//     "root/folderB/file2.txt",
//     "root/folderA/file1.txt",
//     "root/folderB/folderC/file4.txt",
//     "root/folderEmpty/",
//     "root/folderWithSlash/file5.txt",
//     "root/folderWithSlash/",
//     "root\\folderMixed\\file6.txt"
// ];

// Expected Output:

// {
//   root: {
//     folderA: {
//       "file1.txt": null,
//       "file3.txt": null
//     },
//     folderB: {
//       "file2.txt": null,
//       folderC: {
//         "file4.txt": null
//       }
//     },
//     folderEmpty: {},
//     folderWithSlash: {
//       "file5.txt": null
//     },
//     folderMixed: {
//       "file6.txt": null
//     }
//   }
// }



function buildDirectoryTree(paths) {
    // Normalise separators, remove trailing slases, dedupe
    const clean = new Set(
        paths.map(p =>
            p.replace(/\\/g, '/')   // Mixed separators to uniform
            .replace(/\/+/g, '/')   // Remove duplicate slashes
            .replace(/\/$/, '')     // Remove trailing slash
        )
    );

    // Include explicitly empty directories (ending with / in input)
    for (const p of paths) {
        if (/[\/\\]$/.test(p)) { // ends with slash
            clean.add(p.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/\/$/, ''));
        }
    }
    // Build tree
    const root = {};
    for (const path of clean) {
        if (!path) continue;
        const parts = path.split('/');
        let node = root;
        parts.forEach((part, i) => {
            const isFile = i === parts.length - 1 && !paths.some(p =>
                (p.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/\/$/, '')) !== path &&
                (p.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/\/$/, '')).startsWith(path + '/')
            );
            if (i === parts.length - 1) {
                // Last part: file or empty directory
                if (isFile && !node.hasOwnProperty(part)) node[part] = null;
                else if (!isFile && !node.hasOwnProperty(part)) node[part] = {};
            } else {
                if (!node[part]) node[part] = {};
                node = node[part];
            }
        });
    }
    // Sort keys recursively
    function sortObj(obj) {
        if (obj === null) return null;
        const sorted = {};
        Object.keys(obj).sort().forEach(k => {
            sorted[k] = sortObj(obj[k]);
        });
        return sorted;
    }
    return sortObj(root);
}

// Example Usage
const files = [
    "root/folderA/file1.txt",
    "root/folderB/file2.txt",
    "root/folderA/file3.txt",
    "root/folderB/file2.txt",
    "root/folderA/file1.txt",
    "root/folderB/folderC/file4.txt",
    "root/folderEmpty/",
    "root/folderWithSlash/file5.txt",
    "root/folderWithSlash/",
    "root\\folderMixed\\file6.txt"
];

console.log(JSON.stringify(buildDirectoryTree(files), null, 2));