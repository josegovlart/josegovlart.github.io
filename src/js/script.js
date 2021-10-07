$(function () {
    $(".copy-control").hide();
    $(".input-controller").on("keydown change", function (e) {
        let input = $(this);
        let object = $(".object");
        let valor = input.val();
        let id = input.attr('id');
        let keyCode = e.keyCode || e.which;

        if (id == 'tl') {
            object.css("border-top-left-radius", `${valor}%`);
        }
        if (id == 'tr') {
            object.css("border-top-right-radius", `${valor}%`);
        }
        if (id == 'br') {
            object.css("border-bottom-right-radius", `${valor}%`);
        }
        if (id == 'bl') {
            object.css("border-bottom-left-radius", `${valor}%`);
        }

        if (keyCode == 9) {
            e.preventDefault();
            let arr = input.closest('input').nextAll(':has(.input-controller):first').find('.input-controller');
            console.table(arr.prevObject);
        }
        $(".copy-control").show();
        $(".code-snippet").text(getCssCode());
    });

    let getCssCode = () => {
        let styles = "border-radius: " + $(".object").css("border-radius") + ";";
        return styles;
    }

    var clipboard = new ClipboardJS('.copy-clipboard');
});