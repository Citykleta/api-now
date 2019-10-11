/**
 * Hard coded data, when specification are a bit clearer this data will be saved in the database
 */
export default [{
    id: 1,
    title: 'Malecon ride',
    description: 'Riding along the famous Malecon and its sea front wall. Hanging around and catching the breeze like a Cuban',
    stops: [{
        type: 'point_of_interest',
        geometry: {
            type: 'Point',
            coordinates: [-82.358646, 23.145743]
        },
        name: 'Vista al Morro',
        address: {},
        description: 'The entry of the Bay famous for its view on the Morro'
    }, {
        type: 'point_of_interest',
        geometry: {
            type: 'Point',
            coordinates: [-82.371556, 23.141966]
        },
        name: 'Parque Antonio Maceo',
        address: {},
        description: `In front of the famous hero, let's take a break with the young cuban skaters/riders while looking at the fishermen standing on the wall`
    }, {
        type: 'point_of_interest',
        geometry: {
            type: 'Point',
            coordinates: [-82.381616, 23.142877]
        },
        name: 'Hotel national',
        address: {},
        description: 'One of most famous hotel in La Habana, standing on a rock greeting the stormy clouds above the sea'
    }, {
        type: 'point_of_interest',
        geometry: {
            type: 'Point',
            coordinates: [-82.386985, 23.145819]
        },
        name: 'Monte de las banderas',
        address: {},
        description: 'An army of flags facing the symbol of imperialism and an hatred history'
    }, {
        type: 'point_of_interest',
        geometry: {
            type: 'Point',
            coordinates: [-82.409536, 23.132076]
        },
        name: 'Mason de la chorrera',
        address: {},
        description: 'A deserved beer after the ride in the small fort just before going to dance salsa for the whole night next door'
    }],
    geometry: {
        type: 'LineString',
        coordinates: 'jttuN{sglCb@PnAfAnAfA|@n@pAz@pA|@rCdB|C~AzB|@zB~@rB`@rCf@rBNdCFdCHdCFrCXhAP|AFzC?zC?hBChBCxBF@?pBDl@CnAQxC}@xC}@pC_ArC}@tAk@tAk@z@S|@]ZCXFjBrAlBtAjBrAtBvAtBtAtBvAHILHxAcBxAcByAcAyAaA]YC]Z[`@q@OuAOOmBuAGOa@c@kDTSOMQAKFSlB]fCQhCOfBKhBIvBGjCQjBYpDu@`@K|@a@v@UlCUlCUAOrDWtDW`B?`DX`DV~CX`DX|@LpB`@xCbAjBL~@J|CvA|CxA~CvA|CxAzC~A|C~AzC~AzC~AtAn@tAp@@?rAx@hCvBxBnAvBnAxBnAtB~ArB`BtB~Ar@n@b@x@Pl@RrAFl@QhBu@bCGvAX|CX|CHj@RfA`@h@t@d@V^Xv@^DVHPRCNx@y@c@WIBGq@'
    },
    duration: 1234,
    distance: 4321
}, {
    id: 2,
    title: 'Vedado ride',
    description: 'Going from one park to the other in the green and luxuriant havana',
    stops: [{
        type: 'point_of_interest',
        geometry: {
            type: 'Point',
            coordinates: [-82.381037, 23.137287]
        },
        name: 'University of La Habana',
        address: {},
        description: `Let's start at the bottom of the stairs of the majestic University of La Habana`
    }, {
        type: 'point_of_interest',
        geometry: {
            type: 'Point',
            coordinates: [-82.383942, 23.139313]
        },
        name: 'Coppelia',
        address: {},
        description: `The famous icecream stop in Cuba, long queue but very cheap`
    }, {
        type: 'point_of_interest',
        geometry: {
            type: 'Point',
            coordinates: [-82.389597, 23.138096]
        },
        name: 'Avenida de los presidentes',
        address: {},
        description: `One of the most beautiful avenue in town, also a dive in history`
    }, {
        type: 'point_of_interest',
        geometry: {
            type: 'Point',
            coordinates: [-82.390398, 23.137076]
        },
        name: 'El Hueco de Vedado',
        address: {},
        description: `Where one street just sink in a vast hole`
    }, {
        type: 'point_of_interest',
        geometry: {
            type: 'Point',
            coordinates: [-82.394339, 23.13459]
        },
        name: 'Agropecuario',
        address: {},
        description: `A stop to feel how it's like to shop and bargain in one of the biggest vegetables and fruit market in Habana`
    }, {
        type: 'point_of_interest',
        geometry: {
            type: 'Point',
            coordinates: [-82.400203, 23.131965]
        },
        name: 'John Lennon',
        address: {},
        description: `A good stop to take a picture with the famous beatles, seated on a park bench`
    }, {
        type: 'point_of_interest',
        geometry: {
            type: 'Point',
            coordinates: [-82.398728, 23.126031]
        },
        name: 'Colon Cemetery',
        address: {},
        description: `The end of the tour but the beginning of an eventual new adventure in the cemetery`
    }],
    geometry: {
        'type': 'LineString',
        'coordinates': 'r`yuN}~elCjC{AjB}BlB{BjB}B`BhA~AhAJKlBpAlBrAlBpAvAcBxAaBvAcBx@eApA|@@?hChBfCfBhChBfCfBhChBfChBhCfBfChBhCfBfChBbBnA`BnAfBjAdBjApBvApBtApBvAdAoAfAmAd@BbBERQLDBFlCIrBvApBvArBvAvAdAtAdAxA`AvA`AoBzBoBzBoBzBoBzBoBzBuCFuCHsCFuCH'
    },
    duration: 3542,
    distance: 2345
}];