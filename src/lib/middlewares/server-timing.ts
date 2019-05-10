const server_timing_header_name = 'Server-Timing';
export default (name = 'handler') => async (ctx, next) => {
    const now = Date.now();
    await next();
    const header_value = ctx.get(server_timing_header_name)
        .split(',')
        .filter(v => !!v);
    header_value.push(`${name};dur=${Date.now() - now}`);
    const new_header_value = header_value.join(', ');
    ctx.set(server_timing_header_name, new_header_value);
};
