function colorWEtoRGB(colorWE) {
    return "rgb(" + colorWE.split(" ").map(function(c) {
        return Math.round(c * 255);
    }).join(', ') + ")";
}

let values = {}

let originalApplyUserProperties = null;
if (window.wallpaperPropertyListener)
    originalApplyUserProperties = window.wallpaperPropertyListener.applyUserProperties;

window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        if (originalApplyUserProperties != null)
            originalApplyUserProperties(properties);

        for (let property in properties)
            values[property] = properties[property].value;

        if (properties.numberColumns)
            $("main").css("grid-template-columns", "repeat(" + values.numberColumns + ", 1fr)")
        if (properties.numberRows)
            $("main").css("grid-template-rows", "repeat(" + values.numberRows + ", 1fr)")

        if (properties.backgroundColor)
            $("main").css("background", colorWEtoRGB(values.backgroundColor));

        if (properties.gridGap)
            $("main").css("grid-gap", values.gridGap + "px");
            $("main").css("gap", values.gridGap + "px");

        for (let i = 1; i <= 10; i++) {
            if (properties["img" + i + "Enable"]) {
                if (values["img" + i + "Enable"])
                    $(".image:nth-child(" + i + ")").removeClass("hidden");
                else
                    $(".image:nth-child(" + i + ")").addClass("hidden");
            }

            if (properties["img" + i + "Image"])
                $(".image:nth-child(" + i + ")").css("background-image", "url('images/" + values["img" + i + "Image"] + ".jpg')");

            if (properties["img" + i + "ColumnStart"])
                $(".image:nth-child(" + i + ")").css("grid-column-start", "" + values["img" + i + "ColumnStart"]);
            if (properties["img" + i + "ColumnEnd"])
                $(".image:nth-child(" + i + ")").css("grid-column-end", "" + (values["img" + i + "ColumnEnd"] + 1));

            if (properties["img" + i + "RowStart"])
                $(".image:nth-child(" + i + ")").css("grid-row-start", "" + values["img" + i + "RowStart"]);
            if (properties["img" + i + "RowEnd"])
                $(".image:nth-child(" + i + ")").css("grid-row-end", "" + (values["img" + i + "RowEnd"] + 1));

            if (properties["img" + i + "HorizontalPosition"])
                $(".image:nth-child(" + i + ")").css("background-position-x", values["img" + i + "HorizontalPosition"] + "%");
            if (properties["img" + i + "VerticalPosition"])
                $(".image:nth-child(" + i + ")").css("background-position-y", values["img" + i + "VerticalPosition"] + "%");
        }
    }
}