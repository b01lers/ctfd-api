import esbuild from 'rollup-plugin-esbuild';
import { dts } from 'rollup-plugin-dts';


export default [{
    input: 'src/index.ts',
    output: {
        file: 'dist/index.js',
        format: 'cjs'
    },
    plugins: [
        esbuild(),
    ]
}, {
    input: "./src/index.ts",
    output: [{ file: "dist/types.d.ts", format: "es" }],
    plugins: [
        dts()
    ],
}];
