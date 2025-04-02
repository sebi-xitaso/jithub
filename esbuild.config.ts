import esbuild from "esbuild";

esbuild
    .build({
        entryPoints: ["src/content.ts"],
        bundle: true,
        minify: true,
        outfile: "out/content.js",
        target: "esnext",
    })
    .catch(() => process.exit(1));
