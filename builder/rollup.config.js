import terser from "@rollup/plugin-terser"
import dynamicImportVariables from "@rollup/plugin-dynamic-import-vars"
import copy from "rollup-plugin-copy"
import postcss from "rollup-plugin-postcss"
import cssImport from "postcss-import"
import autoprefixer from "autoprefixer"
import cssnanoPlugin from "cssnano"

function componentStyleResolver(componentName) {
    return postcss({
        include: [`src/styles/components/${componentName}.css`],
        extract: `chunks/${componentName}.min.css`,
        plugins: [
            cssImport(),
            autoprefixer(),
            cssnanoPlugin(),
        ],
    })
}

export default [
    {
        input: "src/index.js",
        output: {
            dir: "dist/",
            format: "es",
            entryFileNames: "index.min.js",
            chunkFileNames: "chunks/[name].min.js",
            sourcemap: true,
        },
        external: [
            /\/builder\//,
            /build\.config\.js/,
            /libs\/katex/,
            /libs\/highlight/,
            /libs\/echarts/,
            /libs\/flowchart/,
            /libs\/sequence-diagram/,
            /libs\/frappe-gantt/,
            /libs\/railroad-diagrams/,
            /libs\/qrcode-svg/,
        ],
        plugins: [
            terser(),
            copy({
                targets: [
                    { /* images */
                        src: [
                            "src/imgs/*.svg",
                            "src/imgs/*.jpg",
                            "src/imgs/*.jpeg",
                            "src/imgs/*.png",
                            "src/imgs/*.webp",
                        ],
                        dest: "dist/imgs/"
                    },
                    { /* katex script */
                        src: [
                            "src/libs/katex/*.min.*",
                            "src/libs/katex/katex.map"
                        ],
                        dest: "dist/libs/katex/"
                    },
                    { /* katex fonts */
                        src: "src/libs/katex/fonts/*",
                        dest: "dist/libs/katex/fonts/",
                    },
                    { /* highlight.js */
                        src: [
                            "src/libs/highlight-es/highlight.min.js",
                            "src/libs/highlight-es/highlight.map",
                            "src/libs/highlight-es/github-dark.css"
                        ],
                        dest: "dist/libs/highlight-es/"
                    },
                    { /* highlight.js languages */
                        src: [
                            "src/libs/highlight-es/languages",
                            "src/libs/highlight-es/libs"
                        ],
                        dest: "dist/libs/highlight-es/"
                    },
                    { /* echarts.js */
                        src: "src/libs/echarts/core.js",
                        dest: "dist/libs/echarts/"
                    },
                    { /* echarts.js chunks */
                        src: "src/libs/echarts/chunks/*",
                        dest: "dist/libs/echarts/chunks"
                    },
                    { /* flowchart.js */
                        src: [
                            "src/libs/flowchart.js/*.min.js",
                            "src/libs/flowchart.js/*.map"
                        ],
                        dest: "dist/libs/flowchart.js/"
                    },
                    { /* sequence-diagram */
                        src: "src/libs/sequence-diagram/sequence-diagram-web.mjs",
                        dest: "dist/libs/sequence-diagram/"
                    },
                    { /* frappe-gantt */
                        src: "src/libs/frappe-gantt/*.min.*",
                        dest: "dist/libs/frappe-gantt/"
                    },
                    { /* railroad-diagrams */
                        src: [
                            "src/libs/railroad-diagrams/railroad.min.js",
                            "src/libs/railroad-diagrams/railroad.css",
                        ],
                        dest: "dist/libs/railroad-diagrams/"
                    },
                    { /* qrcode-svg */
                        src: "src/libs/qrcode-svg/qrcode.min.js",
                        dest: "dist/libs/qrcode-svg/"
                    }
                ],
            }),
            componentStyleResolver("fab"),
            componentStyleResolver("catalog"),
            componentStyleResolver("skeleton"),
            postcss({
                include: [
                    "src/styles/*.css",
                    "src/libs/highlight-es/*.css",
                    "src/styles/components/paging.css",
                ],
                extract: "style.min.css",
                plugins: [
                    cssImport(),
                    autoprefixer(),
                    cssnanoPlugin(),
                ],
            }),
            dynamicImportVariables(),
        ]
    },
    {
        input: "src/sw.js",
        output: {
            file: "sw.js",
            format: "es",
            sourcemap: "hidden",
            sourcemapFileNames: "dist/sw.js.map",
        },
        plugins: [
            terser(),
            {   // customized plugin
                name: "sourcemap-path appender",
                renderChunk(code) {
                    const sourcemapPath = "./dist/sw.js.map"
                    code += "\n//# sourceMappingURL=" + sourcemapPath
                    return { code, map: null }
                }
            }
        ]
    }
]
