import typescript from '@rollup/plugin-typescript';

export default [{
    input: 'KaitaiStream.ts',
    output: {
        dir: '.',
        format: 'umd',
        name: 'KaitaiStream'
    },
    plugins: [typescript()]
}];
