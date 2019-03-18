const webpack = require("webpack");
const path = require("path");

module.exports = {
    name: "vendor",
    mode: "development",
    entry: [
        "antd",
        "ramda",
        "react",
        "dexie",
        "immutable",
        "react-dnd",
        "react-dnd-html5-backend",
        "react-dom",
        "react-intl",
        "react-masonry-component",
        "react-redux",
        "react-router",
        "react-router-dom",
        "react-router-redux",
        "react-tap-event-plugin",
        "react-validation-mixin",
        "react-waypoint",
        "redux",
        "redux-saga"
    ],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "vendor.js",
        library: "vendor_[name]"
    },
    plugins: [
        new webpack.DllPlugin({
            name: "vendor_[name]",
            path: path.resolve(__dirname, "dist/manifest.json")
        })
    ]
};
