const dummyData = [
    {
        first_name: 'Amir',
        last_name: 'Megan',
        username: '@Amir'
    },
    {
        first_name: 'Nita',
        last_name: 'Marvin',
        username: '@Nita'
    },
    {
        first_name: 'Xanthus',
        last_name: 'Thor',
        username: '@Xanthus'
    },
    {
        first_name: 'Brennan',
        last_name: 'Jacob',
        username: '@Brennan'
    },
    {
        first_name: 'Lacey',
        last_name: 'Naida',
        username: '@Lacey'
    },
    {
        first_name: 'Tatum',
        last_name: 'Jillian',
        username: '@Tatum'
    },
    {
        first_name: 'Dawn',
        last_name: 'Barbara',
        username: '@Dawn'
    },
    {
        first_name: 'Tamara',
        last_name: 'Britanni',
        username: '@Tamara'
    },
    {
        first_name: 'Imelda',
        last_name: 'Kiayada',
        username: '@Imelda'
    },
    {
        first_name: 'Channing',
        last_name: 'Yuri',
        username: '@Channing'
    },
    {
        first_name: 'Stuart',
        last_name: 'Quemby',
        username: '@Stuart'
    },
    {
        first_name: 'Quail',
        last_name: 'Alfonso',
        username: '@Quail'
    },
    {
        first_name: 'Kuame',
        last_name: 'Cruz',
        username: '@Kuame'
    },
    {
        first_name: 'Cally',
        last_name: 'Laura',
        username: '@Cally'
    },
    {
        first_name: 'Nina',
        last_name: 'Malachi',
        username: '@Nina'
    },
    {
        first_name: 'September',
        last_name: 'Wendy',
        username: '@September'
    },
    {
        first_name: 'Kristen',
        last_name: 'Kalia',
        username: '@Kristen'
    },
    {
        first_name: 'Karen',
        last_name: 'Alan',
        username: '@Karen'
    },
    {
        first_name: 'Rina',
        last_name: 'Ezekiel',
        username: '@Rina'
    },
    {
        first_name: 'Zahir',
        last_name: 'Christopher',
        username: '@Zahir'
    },
    {
        first_name: 'Remedios',
        last_name: 'Sierra',
        username: '@Remedios'
    },
    {
        first_name: 'Pearl',
        last_name: 'Clio',
        username: '@Pearl'
    },
    {
        first_name: 'Stephanie',
        last_name: 'Gail',
        username: '@Stephanie'
    },
    {
        first_name: 'Caesar',
        last_name: 'Zenia',
        username: '@Caesar'
    },
    {
        first_name: 'Cathleen',
        last_name: 'Janna',
        username: '@Cathleen'
    },
    {
        first_name: 'Eve',
        last_name: 'Allen',
        username: '@Eve'
    },
    {
        first_name: 'Mikayla',
        last_name: 'Macaulay',
        username: '@Mikayla'
    },
    {
        first_name: 'Jared',
        last_name: 'Erich',
        username: '@Jared'
    },
    {
        first_name: 'Connor',
        last_name: 'Rinah',
        username: '@Connor'
    },
    {
        first_name: 'Lewis',
        last_name: 'Sophia',
        username: '@Lewis'
    },
    {
        first_name: 'Quinn',
        last_name: 'Bevis',
        username: '@Quinn'
    },
    {
        first_name: 'Fay',
        last_name: 'Sigourney',
        username: '@Fay'
    },
    {
        first_name: 'Seth',
        last_name: 'Lester',
        username: '@Seth'
    },
    {
        first_name: 'Emery',
        last_name: 'Evelyn',
        username: '@Emery'
    },
    {
        first_name: 'Hadley',
        last_name: 'Elijah',
        username: '@Hadley'
    },
    {
        first_name: 'Basil',
        last_name: 'Lilah',
        username: '@Basil'
    },
    {
        first_name: 'Althea',
        last_name: 'Dolan',
        username: '@Althea'
    },
    {
        first_name: 'Henry',
        last_name: 'Janna',
        username: '@Henry'
    },
    {
        first_name: 'Mannix',
        last_name: 'Hollee',
        username: '@Mannix'
    },
    {
        first_name: 'Veda',
        last_name: 'Tashya',
        username: '@Veda'
    },
    {
        first_name: 'Anthony',
        last_name: 'Kylie',
        username: '@Anthony'
    },
    {
        first_name: 'Ariana',
        last_name: 'Demetrius',
        username: '@Ariana'
    },
    {
        first_name: 'Hector',
        last_name: 'Kaseem',
        username: '@Hector'
    },
    {
        first_name: 'William',
        last_name: 'Malcolm',
        username: '@William'
    },
    {
        first_name: 'Quynn',
        last_name: 'Oliver',
        username: '@Quynn'
    },
    {
        first_name: 'Vladimir',
        last_name: 'Bell',
        username: '@Vladimir'
    },
    {
        first_name: 'Ahmed',
        last_name: 'Kirsten',
        username: '@Ahmed'
    },
    {
        first_name: 'Kimberly',
        last_name: 'Odette',
        username: '@Kimberly'
    },
    {
        first_name: 'Dale',
        last_name: 'Lareina',
        username: '@Dale'
    },
    {
        first_name: 'Amery',
        last_name: 'Vaughan',
        username: '@Amery'
    },
    {
        first_name: 'Vernon',
        last_name: 'Colby',
        username: '@Vernon'
    },
    {
        first_name: 'Kyra',
        last_name: 'Tatiana',
        username: '@Kyra'
    },
    {
        first_name: 'Mari',
        last_name: 'Robert',
        username: '@Mari'
    },
    {
        first_name: 'Clayton',
        last_name: 'Rudyard',
        username: '@Clayton'
    },
    {
        first_name: 'Davis',
        last_name: 'Nerea',
        username: '@Davis'
    },
    {
        first_name: 'Aurelia',
        last_name: 'Zenaida',
        username: '@Aurelia'
    },
    {
        first_name: 'Jasmine',
        last_name: 'Vera',
        username: '@Jasmine'
    },
    {
        first_name: 'Kai',
        last_name: 'Nora',
        username: '@Kai'
    },
    {
        first_name: 'Macey',
        last_name: 'Candice',
        username: '@Macey'
    },
    {
        first_name: 'Unity',
        last_name: 'Jorden',
        username: '@Unity'
    },
    {
        first_name: 'Samantha',
        last_name: 'Hyatt',
        username: '@Samantha'
    },
    {
        first_name: 'Hashim',
        last_name: 'Quon',
        username: '@Hashim'
    },
    {
        first_name: 'Minerva',
        last_name: 'Vanna',
        username: '@Minerva'
    },
    {
        first_name: 'Wylie',
        last_name: 'David',
        username: '@Wylie'
    },
    {
        first_name: 'Lavinia',
        last_name: 'Ainsley',
        username: '@Lavinia'
    },
    {
        first_name: 'Dennis',
        last_name: 'Joel',
        username: '@Dennis'
    },
    {
        first_name: 'Patience',
        last_name: 'April',
        username: '@Patience'
    },
    {
        first_name: 'Brielle',
        last_name: 'Olivia',
        username: '@Brielle'
    },
    {
        first_name: 'Abraham',
        last_name: 'Nathan',
        username: '@Abraham'
    },
    {
        first_name: 'Kaye',
        last_name: 'Clare',
        username: '@Kaye'
    },
    {
        first_name: 'Nell',
        last_name: 'Zeph',
        username: '@Nell'
    },
    {
        first_name: 'Colin',
        last_name: 'McKenzie',
        username: '@Colin'
    },
    {
        first_name: 'Philip',
        last_name: 'Sybill',
        username: '@Philip'
    },
    {
        first_name: 'Ori',
        last_name: 'Garrett',
        username: '@Ori'
    },
    {
        first_name: 'Tanya',
        last_name: 'Yoshio',
        username: '@Tanya'
    },
    {
        first_name: 'Meghan',
        last_name: 'Felicia',
        username: '@Meghan'
    },
    {
        first_name: 'Fay',
        last_name: 'Claudia',
        username: '@Fay'
    },
    {
        first_name: 'Montana',
        last_name: 'Kelly',
        username: '@Montana'
    },
    {
        first_name: 'Ila',
        last_name: 'Rhea',
        username: '@Ila'
    },
    {
        first_name: 'Holmes',
        last_name: 'Sydnee',
        username: '@Holmes'
    },
    {
        first_name: 'Jeanette',
        last_name: 'Ashely',
        username: '@Jeanette'
    },
    {
        first_name: 'Kerry',
        last_name: 'Kane',
        username: '@Kerry'
    },
    {
        first_name: 'Clarke',
        last_name: 'Paloma',
        username: '@Clarke'
    },
    {
        first_name: 'Lysandra',
        last_name: 'Demetria',
        username: '@Lysandra'
    },
    {
        first_name: 'Pearl',
        last_name: 'Xandra',
        username: '@Pearl'
    },
    {
        first_name: 'Fredericka',
        last_name: 'Dale',
        username: '@Fredericka'
    },
    {
        first_name: 'Lillith',
        last_name: 'Theodore',
        username: '@Lillith'
    },
    {
        first_name: 'Travis',
        last_name: 'Barry',
        username: '@Travis'
    },
    {
        first_name: 'Dakota',
        last_name: 'Plato',
        username: '@Dakota'
    },
    {
        first_name: 'Ursula',
        last_name: 'Kaye',
        username: '@Ursula'
    },
    {
        first_name: 'Emma',
        last_name: 'Hedy',
        username: '@Emma'
    },
    {
        first_name: 'William',
        last_name: 'Martena',
        username: '@William'
    },
    {
        first_name: 'Ishmael',
        last_name: 'Stacey',
        username: '@Ishmael'
    },
    {
        first_name: 'Dieter',
        last_name: 'Addison',
        username: '@Dieter'
    },
    {
        first_name: 'Jolie',
        last_name: 'Belle',
        username: '@Jolie'
    },
    {
        first_name: 'Forrest',
        last_name: 'Rae',
        username: '@Forrest'
    },
    {
        first_name: 'Leroy',
        last_name: 'Chadwick',
        username: '@Leroy'
    },
    {
        first_name: 'Ray',
        last_name: 'Grant',
        username: '@Ray'
    },
    {
        first_name: 'Ryder',
        last_name: 'Garth',
        username: '@Ryder'
    },
    {
        first_name: 'Wanda',
        last_name: 'Kennedy',
        username: '@Wanda'
    }
];
export default dummyData;
