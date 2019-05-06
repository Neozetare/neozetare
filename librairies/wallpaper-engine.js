window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        $(".we-aside.right").css("visibility", "visible");
        $("#we-console").text(JSON.stringify(properties, null, 4));
    }
};

let savedData = null;

function getAllPropertiesData() {
    let data = {};

    $("#wallpaper-properties .we-property").each(function() {
        const input = this.children[1];

        switch (this.dataset.type) {
            case "bool":
                data[this.id] = {
                    "key": this.id,
                    "text": this.dataset.text,
                    "type": "bool",
                    "value": input.checked,
                    "order": this.dataset.order
                };
                break;

            case "slider":
                const inputNum = this.children[2];
                data[this.id] = {
                    "key": this.id,
                    "text": this.dataset.text,
                    "type": "slider",
                    "min": parseInt(input.min),
                    "max": parseInt(input.max),
                    "editable": inputNum.disabled,
                    "value": inputNum.value == "" ? null : Number(inputNum.value),
                    "order": this.dataset.order
                };
                break;

            case "textinput":
                data[this.id] = {
                    "key": this.id,
                    "text": this.dataset.text,
                    "type": "textinput",
                    "value": input.value,
                    "order": this.dataset.order
                };
                break;

            case "color":
                data[this.id] = {
                    "key": this.id,
                    "text": this.dataset.text,
                    "type": "color",
                    "value":
                        parseInt(input.value.substring(1, 3), 16) / 255 + " " +
                        parseInt(input.value.substring(3, 5), 16) / 255 + " " +
                        parseInt(input.value.substring(5, 7), 16) / 255,
                    "order": this.dataset.order
                };
                break;

            case "file":
                data[this.id] = {
                    "key": this.id,
                    "text": this.dataset.text,
                    "type": "file",
                    "fileType": input.dataset.filetype,
                    "value": input.value,
                    "order": this.dataset.order
                };
                break;

            case "directory":
                data[this.id] = {
                    "key": this.id,
                    "text": this.dataset.text,
                    "type": "directory",
                    "mode": input.dataset.mode,
                    "value": input.value,
                    "order": this.dataset.order
                };
                break;

            case "combo":
                data[this.id] = {
                    "key": this.id,
                    "text": this.dataset.text,
                    "type": "combo",
                    "options": Array.apply(null, input.options).map(opt => ({
                        "label": opt.label,
                        "value": isNaN(parseInt(opt.value)) ? opt.value : parseInt(opt.value)
                    })),
                    "value": isNaN(parseInt(input.value)) ? input.value : parseInt(input.value),
                    "order": this.dataset.order
                };
                break;

            default:
                data[this.id] = {
                    "key": this.id,
                    "text": this.dataset.text,
                    "order": this.dataset.order
                };
                break;
        }
    });

    return data;
}

$(function() {
    $.getJSON("project.json", function(json) {
        const properties = json["general"]["properties"];;
        if (properties !== undefined) {
            const wallpaperProperties = $('<form id="wallpaper-properties"></form>');
            for (key in properties) {
                const label = $("<label>", {
                    id: key,
                    class: "we-property",
                    "data-text": properties[key].text,
                    "data-order": "order" in properties[key] ? properties[key].order : 0,
                    "data-type": properties[key].type,
                    "data-condition": properties[key].condition
                });
                label.append($("<span>", {
                    text: properties[key].text
                }));
                wallpaperProperties.append(label);

                switch (properties[key].type) {
                    case "bool":
                        label.append($("<input>", {
                            type: "checkbox",
                            name: key,
                            checked: properties[key].value,
                            class: "we-input"
                        }));
                        break;

                    case "slider":
                        label.append($("<input>", {
                            type: "range",
                            name: key,
                            min: properties[key].min,
                            max: properties[key].max,
                            value: properties[key].value,
                            id: key + "Range",
                            class: "we-input",
                            oninput: "this.form." + key + "Number.value = this.value"
                        }));
                        label.append($("<input>", {
                            type: "number",
                            step: "any",
                            disabled: !properties[key].editable,
                            value: properties[key].value,
                            id: key + "Number",
                            oninput: "this.form." + key + "Range.value = this.value"
                        }));
                        break;

                    case "textinput":
                        label.append($("<input>", {
                            type: "text",
                            name: key,
                            value: properties[key].value,
                            class: "we-input"
                        }));
                        break;

                    case "color":
                        label.append($("<input>", {
                            type: "color",
                            name: key,
                            value: "#" + properties[key].value.split(" ").map(function(c) {
                                let hex = Math.round(c * 255).toString(16);
                                return hex.length == 1 ? "0" + hex : hex;
                            }).join(''),
                            class: "we-input"
                        }));
                        break;

                    case "file":
                        label.append($("<span>", {
                            text: "input file not supported",
                            type: "file",
                            name: key,
                            class: "we-input",
                            "data-filetype": properties[key].fileType
                        }));
                        break;

                    case "directory":
                        label.append($("<span>", {
                            text: "input directory not supported",
                            type: "directory",
                            name: key,
                            class: "we-input",
                            "data-mode": properties[key].mode
                        }));
                        break;

                    case "combo":
                        const select = $("<select>", {
                            name: key,
                            class: "we-input"
                        });
                        const options = properties[key].options
                        for (let i=0; i < options.length; i++) {
                            select.append($("<option>", {
                                value: options[i]["value"],
                                text: options[i]["label"],
                                selected: properties[key].value == options[i].value
                            }));
                        }
                        label.append(select);
                        break;
                }
            }

            wallpaperProperties.find("label").sort(function (a, b) {
                return +a.dataset.order - +b.dataset.order;
            }).appendTo(wallpaperProperties);

            $("body").append($("<aside>", {class: "we-aside"})
                .append('\
                    <h2 class="head-aside"><span class="toggle-aside">[-]</span> properties (<span id="fps"></span> fps)</h2>\
                    <hr/>')
                .append(wallpaperProperties)
            );

            $("body").append('\
                <aside class="we-aside right hidden">\
                    <h2><span class="toggle-aside">[-]</span> data <span id="get-data" class="button">[get all data]</span> <span id="set-data" class="button">[set data]</span></h2>\
                    <hr/>\
                    <pre id="we-console"></pre>\
                </aside>\
            ');
        }

        $("#wallpaper-properties .we-input, #wallpaper-properties .we-input + input[type='number']").on("input", function() {
            const data = getAllPropertiesData();
            let newData = {};
            for (let key in data) {
                if (savedData == null || data[key].value != savedData[key].value) {
                    newData[key] = data[key];
                }
            }

            window.wallpaperPropertyListener.applyUserProperties(newData);

            Object.assign(window, data);
            $("#wallpaper-properties .we-property").each(function() {
                if (this.dataset.condition !== undefined) {
                    if (eval(this.dataset.condition))
                        $(this).css("display", "");
                    else
                        $(this).css("display", "none");
                }
            });

            savedData = data;
        });

        $("#wallpaper-properties .we-input").first().trigger("input");

        $(".toggle-aside").click(function() {
            $(this).closest('aside').toggleClass("hidden");
        });

        $("#get-data").click(function() {
            window.prompt("copy to clipboard", JSON.stringify(getAllPropertiesData()));
        });

        $("#set-data").click(function() {
            window.wallpaperPropertyListener.applyUserProperties(JSON.parse(
                window.prompt("set data")
            ));
        });

        window.requestAnimFrame = (function(){
            return window.requestAnimationFrame    ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.ieRequestAnimationFrame     ||
                function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();

        var fpsElement = document.getElementById("fps");
        var fps = 0;

        var then = Date.now() / 1000;
        var render = function() {
                var now = Date.now() / 1000;

                var elapsedTime = now - then;
                then = now;

                fps = Math.round(1 / elapsedTime);

                requestAnimFrame(render);
        };
        render();

        window.setInterval(function() {
            fpsElement.innerText = fps;
        }, 100);
    });
});