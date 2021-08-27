$(document).ready(function () {
    const data = {
        id: '',
        get_new_id: () => new Date().getTime(),
        cache: {}
    }

    function handleEvents() {
        $('.form').on('submit', (e) => {
            if ($("input[name=_method]").val() == 'post') {
                refreshId();
            }
            e.preventDefault();
            let fd = new FormData(document.forms[0]);

            fd.append('id', data.id);

            $.ajax({
                type: "post",
                url: "store.php",
                data: fd,
                contentType: false,
                processData: false,
                success: function (response) {
                    get_result();
                },
                error: function (response) {
                    alert("Something went wrong");
                }

            });
        })
        $('.add-record').on('click', () => {
            setUpAdd();
        })
    }
    /**
     * Show updated record
     * @param {object} data 
     */
    function paintTable(data) {
        $('tbody').html('');
        for (key in data) {

            let single = data[key];
            let tr = buildTr(single);
            let edit = document.createElement('span');

            edit.dataset.id = single.id;
            edit.addEventListener('click', setUpEdit);
            // edit.innerText = 'edit';
            edit.innerHTML = 'edit';
            edit.classList.add('edit')

            tr.appendChild(edit);
            $('tbody').append(tr);
        }
    }
    /**
     * Get new Id
     */
    function refreshId() {
        data.id = data.get_new_id();
    }
    /**
     * Set page up for editing
     * @param {HTMLElement} edit 
     */
    function setUpEdit(edit) {
        $('.add-record').show();
        data.id = edit.target.dataset.id

        $('input[name=_method]').val('update');
        $('h2.title').text('Edit Record Page');
        let unit = data.cache[data.id];
        $('input[name=product]').val(unit.product);
        $('input[name=quantity]').val(unit.quantity);
        $('input[name=price]').val(unit.price);
    }
    /**
     * Set page up for adding new record
     */
    function setUpAdd() {
        refreshId();
        $('input[name=_method]').val('post');
        $('h2.title').text('Add New Record Page');
        $('input[name=product]').val('');
        $('input[name=quantity]').val('');
        $('input[name=price]').val('');
        $('.add-record').hide();
    }

    /**
     * Build table rows
     * @param {object} single 
     * @returns HTMLElement tr
     */
    function buildTr(single) {
        let tr = document.createElement('tr');
        let product = sortCells(single.product)
        tr.appendChild(product);
        let quantity = sortCells(single.quantity)

        tr.append(quantity);
        let price = sortCells(single.price)
        tr.appendChild(price);
        let date = new Date(parseInt(single.id));
        let stringData = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}`;

        let time = sortCells(stringData)
        tr.appendChild(time);
        let total = sortCells(parseFloat(single.price) * parseFloat(single.quantity));
        tr.appendChild(total);
        return tr
    }

    /**
     * Build table data
     * @param {string} data 
     * @returns 
     */
    function sortCells(data) {
        let td = document.createElement('td');
        let div = document.createElement('div');
        div.innerText = data;
        td.appendChild(div);
        return td;
    }
    /**
     * Get result from storage
     */
    function get_result() {

        $.ajax({
            type: "GET",
            url: "store.php?all",
            success: function (response) {
                if (response.error) {
                    alert(response.message);
                }
                $('.loading').hide();
                $('table').show();
                console.log(response.data);
                if (response.data) {
                    data.cache = response.data;
                    paintTable(response.data);
                }
            },
            error: function (response) {
                alert("Something went wrong with fetching");
            }

        });
    }
    function init() {
        get_result();
        handleEvents();
    }
    init();
})