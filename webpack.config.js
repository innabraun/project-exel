const path=require("path")
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HTMLWebpackPlugin=require("html-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')



const isProd=process.env.NODE_ENV==='production';//отвечают за то в каком режиме мы находимся
const isDev=!isProd

const filename=ext=>isDev? `bundle.${ext}` :`bundle.[hash].${ext}`
const jsLoaders =()=>{
    const loaders= [{
        loader: "babel-loader",
            options: {
            presets: ['@babel/preset-env']
    }
    }

    ]
    if (isDev){
     loaders.push("eslint-loader")
    }
    return loaders
}

module.exports={
    context: path.resolve(__dirname,"src"), //пути
    mode:"development", //режим разработчика
    entry: ["@babel/polyfill","./index.js"], //указываем входные точки для приложения//ентри єто обьект
    output: {
        filename: filename("js"),
        path: path.resolve(__dirname,"dist")
    },
    resolve: {
        extensions: [".js"], //по умолчанию я хочу грузить такие файлы как .js
        alias: { //это что б не писать /./../../core/Component я прописываю елиас
              "@":path.resolve(__dirname,"src"),
              "@core":path.resolve(__dirname, "src/core")
        }
    },
    devtool: isDev ? "source-map" : false,
    devServer: {
        port:3000,
        //hot:isDev
    },
    // devServer: {
    //     overlay: true,
    //     open: true
    // },
    plugins: [
        new CleanWebpackPlugin(), //clean the folder dist
        new HTMLWebpackPlugin({ //создает хтмл в дист
            template: "index.html",
            minify: {
                removeComments: isProd,
                collapseWhitespace: isProd
            }
        }),
        new CopyPlugin({ //что бы переносить фавикон используем
            patterns: [
                { from: path.resolve(__dirname, "src/favicon.ico"),
                    to:path.resolve(__dirname, "dist")
                },

            ],
        }),
        new MiniCssExtractPlugin({ //нужен что бы выносить css из джс в отдельный файл
filename: filename("css")//показывает куда положить файл
        })
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                           // hmr :isDev,
                            //reloadAll:true
                        },
                    },
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader"
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:jsLoaders()
            }
        ],
    }

}