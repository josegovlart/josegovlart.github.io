$(function () {
    $(".copy-control").hide();
    $(".input-controller").on("keydown change", function (e) {
        let input = $(this);
        let object = $(".object");
        let valor = input.val();
        let id = input.attr('id');
        let keyCode = e.keyCode || e.which;
        let unit;

        if ($(".form-check-input:checked").attr('id') == 'porcentage') {
            unit = '%';
        } else {
            unit = 'px';
        }

        console.log(unit);
        if (id == 'tl') {
            object.css("border-top-left-radius", `${valor + unit}`);
        }
        if (id == 'tr') {
            object.css("border-top-right-radius", `${valor + unit}`);
        }
        if (id == 'br') {
            object.css("border-bottom-right-radius", `${valor + unit}`);
        }
        if (id == 'bl') {
            object.css("border-bottom-left-radius", `${valor + unit}`);
        }

        if (keyCode == 9) {
            e.preventDefault();
            let arr = input.closest('input').nextAll(':has(.input-controller):first').find('.input-controller');
            console.table(arr.prevObject);
        }
        $(".copy-control").show();
        $(".code-snippet").text(getCssCode());
    });
    $("#checkbox-background-image").change(function () {
        if ($(this).prop('checked')) {
            getRandomImage();
        } else {
            $('.object').css('background-image', 'none');
        }
    });

    let getCssCode = () => {
        let styles = "border-radius: " + $(".object").css("border-radius") + ";";
        return styles;
    }

    let getRandomImage = () => {
        var keyword = "mountain";
        $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
            {
                tags: keyword,
                tagmode: "any",
                format: "json"
            },
            function (data) {
                var rnd = Math.floor(Math.random() * data.items.length);

                var image_src = data.items[rnd]['media']['m'].replace("_m", "_b");

                $(".object").css({ "background-image": "url('" + image_src + "')", "background-size": "cover" });

            });
    }


    var clipboard = new ClipboardJS('.copy-clipboard');
});

