// Tema för Grommet

const ChatTheme = {
    global: {
        // Genererade ett färgtema enligt Material Design principerna, 
        // Finns länkat här: https://material.io/resources/color/#!/?view.left=0&view.right=1&primary.color=000000&secondary.color=ff5b79
        colors: {
            primary: {
                dark: "#000000",
                light: "#2c2c2c"
            },
            secondary: {
                dark: "#ff5b79",
                light: "ff8fa8"
            },
            danger: {
                dark: "#c7204d",
                light: "#c7204d"
            },
            shadow: {
                dark: "#2c2c2c",
                light: "#2c2c2c"
            },
            shadow2: {
                dark: "#cccccc",
                light: "#cccccc"
            },
        },
        font: {
            family: "Roboto"
        },
        focus: {
            border: {
                color: "transparent"
            },
            shadow: {
                color: "transparent"
            }
        },
        input: {
            font: {
                size: "small",
                weight: 400,
            }
        }
    },
}

export default ChatTheme;