"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const categories = {
    white_space: 0,
    punctuator: 1,
    identifier: 2,
    keyword: 3
};
const qualifiers = [
    'calle',
    'autopista',
    'avenida',
    'calejon',
    'calzada',
    'carretera',
    'ave'
];
const keywords = [
    'esquina',
    'esq',
    'entre',
    'e',
    'no',
    'y'
];
const punctuators = [',', '/', '.', '#'];
const white_space_regexp = /\s/;
const number_regexp = /^\d+\D*/;
const create_from_category = category => value => ({
    category,
    value
});
const create_white_space_token = create_from_category(categories.white_space);
const create_punctuator_token = create_from_category(categories.punctuator);
const create_identifier_token = create_from_category(categories.identifier);
const create_keyword_token = create_from_category(categories.keyword);
const tokenize = module.exports.tokenize = function* (candidate) {
    const source = candidate
        .toLowerCase()
        .trim();
    let buffer = '';
    const purge_buffer = () => {
        const token = keywords.includes(buffer) ? create_keyword_token(buffer) : create_identifier_token(buffer);
        buffer = '';
        return token;
    };
    for (const c of source) {
        const is_white_space = white_space_regexp.test(c);
        const is_punctuator = punctuators.includes(c);
        if (is_white_space || is_punctuator) {
            const token = purge_buffer();
            if (token.value.length) {
                yield token;
            }
            yield is_white_space ? create_white_space_token(c) :
                create_punctuator_token(c);
        }
        else {
            buffer += c;
        }
    }
    if (buffer.length) {
        yield purge_buffer();
    }
};
const lazy_filter = (filterFunc) => function* (iterable) {
    for (const item of iterable) {
        if (filterFunc(item)) {
            yield item;
        }
    }
};
const filter_out_white_space = lazy_filter(item => item.category !== categories.white_space);
const stream = iterable => {
    let buffer = [];
    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            return buffer.length ? buffer.shift() : iterable.next();
        },
        seeNext(offset = 0) {
            if (buffer.length > offset) {
                return buffer[offset];
            }
            buffer.push(iterable.next());
            return this.seeNext(offset);
        },
        eat(number = 1) {
            this.next();
            number--;
            return number === 0 ? this : this.eat(number);
        },
        expect(value) {
            const { value: next_value } = this.seeNext();
            if (next_value.value !== value) {
                throw new Error(`expected ${value} but got ${next_value.value}`);
            }
            return this.eat();
        },
        eventually(value) {
            const { value: next_value } = this.seeNext();
            const match = next_value.value === value;
            if (match) {
                this.eat();
            }
            return match;
        }
    };
};
const create_house_number_node = (value) => ({
    type: 'house_number',
    value
});
const create_identifier_node = (value) => {
    if (value.length > 1) {
        const [first, ...rest] = value;
        if (qualifiers.includes(first)) {
            return {
                type: 'identifier',
                qualifier: first,
                value: rest
            };
        }
    }
    return {
        type: 'identifier',
        value: value
    };
};
const create_between_node = (val1, val2) => ({
    type: 'between',
    value: [
        val1,
        val2
    ]
});
const create_corner_node = (...args) => ({
    type: 'corner',
    value: [...args]
});
const parse_dash = (token_stream) => {
    token_stream.expect('#');
    return create_house_number_node(parse_identifier(token_stream));
};
const parse_no = (token_stream) => {
    token_stream.expect('no');
    token_stream.eventually('.');
    return create_house_number_node(parse_identifier(token_stream));
};
const parse_entre = (token_stream) => {
    token_stream.expect('entre');
    const first = parse_identifier(token_stream);
    token_stream.expect('y');
    const second = parse_identifier(token_stream);
    return create_between_node(first, second);
};
const parse_e_slash = (token_stream) => {
    token_stream.expect('e');
    token_stream.eventually('/');
    const first = parse_identifier(token_stream);
    token_stream.expect('y');
    const second = parse_identifier(token_stream);
    return create_between_node(first, second);
};
const parse_identifier = (token_stream, content = []) => {
    const { value: next, done } = token_stream.seeNext();
    if (done === true || next.category !== categories.identifier) {
        return create_identifier_node(content);
    }
    token_stream.eat();
    content.push(next.value);
    return parse_identifier(token_stream, content);
};
const parse_esquina = (token_stream) => {
    token_stream.expect('esquina');
    const first = parse_identifier(token_stream);
    if (token_stream.eventually('y')) {
        return create_corner_node(first, parse_identifier(token_stream));
    }
    return create_corner_node(first);
};
const parse_esq = (token_stream) => {
    token_stream.expect('esq');
    token_stream.eventually('.');
    const first = parse_identifier(token_stream);
    if (token_stream.eventually('y')) {
        return create_corner_node(first, parse_identifier(token_stream));
    }
    return create_corner_node(first);
};
exports.parse = function* (source) {
    const token_stream = stream(filter_out_white_space(tokenize(source)));
    const { value: nextValue, done } = token_stream.seeNext();
    if (done) {
        return;
    }
    const { value, category } = nextValue;
    switch (value) {
        case 'no':
            yield parse_no(token_stream);
            break;
        case '#':
            yield parse_dash(token_stream);
            break;
        case 'entre':
            yield parse_entre(token_stream);
            break;
        case 'e':
            yield parse_e_slash(token_stream);
            break;
        case 'esquina':
            yield parse_esquina(token_stream);
            break;
        case 'esq':
            yield parse_esq(token_stream);
            break;
        default: {
            if (category === categories.identifier) {
                yield parse_identifier(token_stream);
            }
            else {
                yield token_stream.next();
            }
        }
    }
    yield* exports.parse(token_stream);
};
const second_pass = function* (iterable) {
};
