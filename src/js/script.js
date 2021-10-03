$(".input-controller").keydown(
    function (e) {
        let input = $(this);
        let object = $(".object");
        let valor = input.val();
        let id = input.attr('id');

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
        var keyCode = e.keyCode || e.which;
        if (keyCode == 9) {
            e.preventDefault();
            // call custom function here
            // console.table(input.next().attr('id'))
            let arr = input.closest('input').nextAll(':has(.input-controller):first').find('.input-controller');
            console.table(arr.prevObject);
            
        }

    }
);