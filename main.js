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

        if (properties.img1Enable) {
            if (values.img1Enable)
                $(".image:nth-child(1)").removeClass("hidden");
            else
                $(".image:nth-child(1)").addClass("hidden");
        }

        if (properties.img1Image)
            $(".image:nth-child(1)").css("background-image", "url('images/" + values.img1Image + ".jpg')");

        if (properties.img1ColumnStart)
            $(".image:nth-child(1)").css("grid-column-start", "" + values.img1ColumnStart);
        if (properties.img1ColumnEnd)
            $(".image:nth-child(1)").css("grid-column-end", "" + (values.img1ColumnEnd + 1));

        if (properties.img1RowStart)
            $(".image:nth-child(1)").css("grid-row-start", "" + values.img1RowStart);
        if (properties.img1RowEnd)
            $(".image:nth-child(1)").css("grid-row-end", "" + (values.img1RowEnd + 1));

        if (properties.img1HorizontalPosition)
            $(".image:nth-child(1)").css("background-position-x", values.img1HorizontalPosition + "%");
        if (properties.img1VerticalPosition)
            $(".image:nth-child(1)").css("background-position-y", values.img1VerticalPosition + "%");
    }
}