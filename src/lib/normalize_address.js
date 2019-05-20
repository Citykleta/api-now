"use strict";
// const municipalities = [
//     'Habana del Este',
//     'Boyeros',
//     'Guanabacoa',
//     'San Antonio de los Baños',
//     'Bejucal',
//     'Diez de Octubre',
//     'Arroyo Naranjo',
//     'Cotorro',
//     'La Lisa',
//     'Playa',
//     'San Miguel del Padrón',
//     'Marianao',
//     'Plaza de la Revolución',
//     'Cerro',
//     'Regla',
//     'La Habana Vieja',
//     'Centro Habana'
// ];
Object.defineProperty(exports, "__esModule", { value: true });
const qualifiers = [
    'calle',
    'autopista',
    'avenida',
    'callejon',
    'calzada',
    'carretera',
    'ave'
];
const keywords = [
    'esquina',
    'esq',
    'entre',
    'e',
    'y',
    'no',
];
const punctuators = [',', '/', '.', '#'];
const white_space_regexp = /\s/;
const create_from_category = category => value => ({
    category,
    value
});
const create_white_space_token = create_from_category(0 /* WHITE_SPACE */);
const create_punctuator_token = create_from_category(1 /* PUNCTUATOR */);
const create_identifier_token = create_from_category(2 /* IDENTIFIER */);
const create_keyword_token = create_from_category(3 /* KEYWORD */);
function* tokenize(candidate) {
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
}
exports.tokenize = tokenize;
const lazy_filter = (filterFunc) => function* (iterable) {
    for (const item of iterable) {
        if (filterFunc(item)) {
            yield item;
        }
    }
};
const filter_out_white_space = lazy_filter(item => item.category !== 0 /* WHITE_SPACE */);
const stream = (iterator) => {
    let buffer = [];
    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            return buffer.length ? buffer.shift() : iterator.next();
        },
        seeNext(offset = 0) {
            if (buffer.length > offset) {
                return buffer[offset];
            }
            buffer.push(iterator.next());
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
    if (done === true || next.category !== 2 /* IDENTIFIER */) {
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
const parse_stream = function* (token_stream) {
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
            if (category === 2 /* IDENTIFIER */) {
                yield parse_identifier(token_stream);
            }
            else {
                yield token_stream.next().value;
            }
        }
    }
    yield* parse_stream(token_stream);
};
exports.parse = (source) => parse_stream(stream(filter_out_white_space(tokenize(source))));
const create_street_like = (node) => {
    const { value, qualifier } = node;
    const street = {
        name: value.join(' ')
    };
    if (qualifier) {
        street.qualifier = qualifier;
    }
    return street;
};
// use unused punctuation to group items together
const group = (address_parts) => {
    const parts = [...address_parts];
    const groups = [];
    let sub_group = [];
    let current;
    while (current = parts.shift()) {
        if (current.category === 1 /* PUNCTUATOR */) {
            if (sub_group.length) {
                groups.push(sub_group);
            }
            sub_group = [];
        }
        else {
            sub_group.push(current);
        }
    }
    if (sub_group.length) {
        groups.push(sub_group);
    }
    return groups;
};
// take punctuation into account
exports.create_address = (candidate) => {
    const parts = group([...exports.parse(candidate)]);
    let address = {};
    for (let i = 0; i < parts.length; i++) {
        const group = parts[i];
        for (const p of group) {
            switch (p.type) {
                case 'identifier': {
                    if ((i === 0 && parts.length > 1) || p.qualifier) {
                        address.street = create_street_like(p);
                    }
                    else if (i === parts.length - 1) {
                        address.municipality = p.value.join(' ');
                    }
                    break;
                }
                case 'house_number': {
                    address.number = p.value.value.join(' ');
                    break;
                }
                case 'between': {
                    const { value } = p;
                    if (value.length === 2) {
                        address.between = value.map(create_street_like);
                    }
                    break;
                }
                default:
                // unknown node -> do nothing
            }
        }
    }
    return address;
};
