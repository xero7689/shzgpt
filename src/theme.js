export const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                primary: {
                    main: '#e8e8e8',
                    light: '#f8f8f8',
                    border: '#d7d7d7',
                    contrastText: '#6b6b6b'
                },
                secondary: {
                    main: '#7d33d7',
                    light: '#c09eee',
                    contrastText: '#f1e8fb',
                },
                thirdary: {
                    main: '#4299e3',
                    contrastText: '#e5f2fb'
                },
                info: {
                    main: '#d7d7d7',
                    border: '#b3b3b3',
                    contrastText: '#ebdbb2',
                },
                background: {
                    default: '#f1f1f1',
                    paper: '#f8f8f8'
                }

            }
            : {
                primary: {
                    main: '#282828',
                    light: '#4a4a4a',
                    border: '#3c3836',
                    contrastText: '#ebdbb2'
                },
                secondary: {
                    main: '#458588',
                    light: '#d4d5d5',
                    contrastText: '#d4d5d5',
                },
                thirdary: {
                    main: '#689d6a'
                },
                info: {
                    main: '#3c3836',
                    border: '#504945',
                    contrastText: '#ebdbb2',
                },
                background: {
                    default: '#1d2021',
                    paper: '#282828'
                }
            }),
    },

});