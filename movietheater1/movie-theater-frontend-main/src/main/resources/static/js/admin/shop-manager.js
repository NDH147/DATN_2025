$(document).ready(function () {
    const $tableBody = $('#food-table-body');
    const $paging = $('.paging');
    const $managerContainer = $('.manager-container');

    function loadFoods(page = 1) {
        $.ajax({
            url: `http://localhost:8080/api/pub/food?page=${page - 1}&size=5`,
            method: 'GET',
            success: function (data) {
                const foods = data.content;
                $tableBody.empty();

                if (foods.isEmpty) {
                    $tableBody.append('<tr><td colspan="7">Không tìm thấy đồ ăn nào</td></tr>');
                } else {
                    foods.forEach(function (food) {
                        const imageUrl = food.image ? 
                            `http://localhost:8080/uploads/${food.image}` : 
                            '/images/default-food.png';
                        
                        const isOutOfStock = food.stock <= 0;
                        const stockStatus = isOutOfStock ? 
                            '<span class="status-badge out-of-stock">Hết hàng</span>' : 
                            '<span class="status-badge in-stock">Còn hàng</span>';

                        const enabledStatus = food.isEnabled ? 
                            '<button class="btn-status food-active" data-id="' + food.id + '"><i class="fas fa-eye"></i>Hiển thị</button>' : 
                            '<button class="btn-status food-inactive" data-id="' + food.id + '"><i class="fas fa-eye-slash"></i>Ẩn</button>';
                        
                        $tableBody.append(`
                        <tr>
                            <td>${food.id || 'N/A'}</td>
                            <td><img src="${imageUrl}" alt="${food.name}" class="food-thumbnail"></td>
                            <td>${food.name || 'N/A'}</td>
                            <td>${food.price ? food.price.toLocaleString('vi-VN') : 'N/A'} đ</td>
                            <td>${food.stock || '0'}</td>
                            <td>${stockStatus}</td>
                            <td>${enabledStatus}</td>
                            <td class="action-buttons">
                                <button class="btn-detail btn-detail-food" data-id="${food.id}">
                                    <i class="fas fa-info-circle"></i>
                                    Chi tiết
                                </button>
                                <button class="btn-delete btn-delete-food" data-id="${food.id}">
                                    <i class="fas fa-trash"></i>
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    `);
                    });
                }
                handlePagination(data);
            },
            error: function () {
                toastr.error('Có lỗi xảy ra khi tải dữ liệu đồ ăn.');
            }
        });
    }

    loadFoods();

    function handlePagination(data) {
        $paging.empty();

        const totalPages = data.totalPages;
        const currentPage = data.number + 1;
        const hasPrevious = data.number > 0;
        const hasNext = data.number < totalPages - 1;

        if (hasPrevious) {
            $paging.append(`<a href="#" class="paging-item previous" data-page="${currentPage - 1}">&laquo; Previous</a>`);
        }

        for (let i = 1; i <= totalPages; i++) {
            $paging.append(`<a href="#" class="paging-item ${currentPage === i ? 'active' : ''}" data-page="${i}">${i}</a>`);
        }

        if (hasNext) {
            $paging.append(`<a href="#" class="paging-item next" data-page="${currentPage + 1}">Next &raquo;</a>`);
        }

        $('.paging-item').on('click', function (e) {
            e.preventDefault();
            loadFoods($(this).data('page'));
        });
    }

    // Show add food form
    $(document).on('click', '.add-food', function (e) {
        e.preventDefault();
        $('.form-food-add').css('opacity', '1').css('top', '50%');
        $('.manager-container').css('opacity', '1').css('z-index','1');
    });

    // Show food detail form
    $(document).on('click', '.btn-detail-food', function (e) {
        e.preventDefault();
        var foodId = $(this).data('id');
        callApiGetFoodById(foodId);
        $('.form-food-edit').css('opacity', '1').css('top', '50%');
        $('.manager-container').css('opacity', '1').css('z-index','1');
    });

    // Close form
    $(document).on('click', '.close-icon', function (e) {
        e.preventDefault();
        $('.form-food-add, .form-food-edit').css('opacity', '0').css('top', '150%');
        $('.manager-container').css('opacity', '0').css('z-index','-1');
    });

    // Handle submit of add new food form
    function saveFood() {
        $(document).on('click', ".btn-add-food", function (e) {
            e.preventDefault();

            var formData = new FormData();
            formData.append('name', $('.food-name').val());
            formData.append('price', $('.food-price').val());
            formData.append('stock', $('.food-stock').val());
            formData.append('description', $('.food-description').val());
            
            var imageFile = $('.food-image')[0].files[0];
            if (imageFile) {
                formData.append('image', imageFile);
            }

            callApiSaveFood(formData);
        });
    }

    function callApiSaveFood(formData) {
        $.ajax({
            url: "http://localhost:8080/api/pub/food",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                toastr.success('Đồ ăn đã được thêm thành công!');
                $('.form-food-add').css('opacity', '0').css('top', '150%');
                $('.manager-container').css('opacity', '0').css('z-index','-1');
                loadFoods();
            },
            error: function (xhr) {
                var response = JSON.parse(xhr.responseText);
                toastr.error(response.message || 'Có lỗi xảy ra khi thêm đồ ăn.');
            }
        });
    }
    saveFood();

    function renderFoodDetail(food, mode) {
        if (mode === 'view') {
            // Populate view modal
            $('#food-name-view').text(food.name);
            $('#food-price-view').text(food.price.toLocaleString('vi-VN') + ' đ');
            $('#food-stock-view').text(food.stock);
            $('#food-description-view').text(food.description);
            $('#food-status-view').text(food.stock > 0 ? 'Còn hàng' : 'Hết hàng');
            
            const imageUrl = food.image ? 
                `http://localhost:8080/uploads/${food.image}` : 
                '/images/default-food.png';
            $('#food-image-view').attr('src', imageUrl);
            
            // Show view modal
            $('.form-food-view').css('opacity', '1').css('top', '50%');
            $('.manager-container').css('opacity', '1').css('z-index','1');
        } else {
            // Populate edit form
            $('#food-id-update').val(food.id);
            $('#food-name-update').val(food.name);
            $('#food-price-update').val(food.price);
            $('#food-stock-update').val(food.stock);
            $('#food-description-update').val(food.description);
            
            const imageUrl = food.image ? 
                `http://localhost:8080/uploads/${food.image}` : 
                '/images/default-food.png';
            $('#current-food-image').attr('src', imageUrl);
            
            // Show edit modal
            $('.form-food-edit').css('opacity', '1').css('top', '50%');
            $('.manager-container').css('opacity', '1').css('z-index','1');
        }
    }

    function callApiGetFoodById(id, mode = 'edit') {
        var settings = {
            url : "http://localhost:8080/api/pub/food/"+id,
            method: "GET",
            success: function (response) {
                renderFoodDetail(response.data, mode);
            },
            error: function (xhr) {
                var response = JSON.parse(xhr.responseText);
                toastr.error(response.message || 'Có lỗi xảy ra khi lấy thông tin đồ ăn.');
            }
        }
        $.ajax(settings);
    }

    function updateFood() {
        $(document).on('click', ".btn-edit-food", function (e) {
            e.preventDefault();
            var form = new FormData();
            form.append('id', parseInt($('#food-id-update').val(), 10));
            form.append('name', $('#food-name-update').val());
            form.append('price', $('#food-price-update').val());
            form.append('stock', $('#food-stock-update').val());
            form.append('description', $('#food-description-update').val());

            var imageFile = $('#food-image-update')[0].files[0];
            if (imageFile) {
                form.append('image', imageFile);
            }

            callApiUpdateFood(form);
        });
    }

    function callApiUpdateFood(formData) {
        $.ajax({
            url: "http://localhost:8080/api/pub/food",
            type: "PUT",
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                toastr.success('Cập nhật đồ ăn thành công!');
                $('.form-food-edit').css('opacity', '0').css('top', '150%');
                $('.manager-container').css('opacity', '0').css('z-index','-1');
                loadFoods();
            },
            error: function (xhr) {
                var response = JSON.parse(xhr.responseText);
                toastr.error(response.message || 'Có lỗi xảy ra khi cập nhật đồ ăn.');
            }
        });
    }

    updateFood();

    // Preview image before upload
    $(document).on('change', '.food-image', function(e) {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                if($(this).attr('id') === 'food-image-update') {
                    $('#current-food-image').attr('src', e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    });

    // Xử lý sự kiện xóa đồ ăn
    $(document).on('click', '.btn-delete-food', function() {
        const foodId = $(this).data('id');
        if (confirm('Bạn có chắc chắn muốn xóa đồ ăn này không?')) {
            $.ajax({
                url: `http://localhost:8080/api/pub/food/${foodId}`,
                method: 'DELETE',
                success: function(response) {
                    toastr.success('Xóa đồ ăn thành công!');
                    loadFoods();
                },
                error: function(xhr) {
                    const response = JSON.parse(xhr.responseText);
                    toastr.error(response.message || 'Có lỗi xảy ra khi xóa đồ ăn.');
                }
            });
        }
    });

    // Toggle food status
    $(document).on('click', '.btn-status', function() {
        const foodId = $(this).data('id');
        $.ajax({
            url: `http://localhost:8080/api/pub/food/${foodId}/toggle-status`,
            method: 'POST',
            success: function(response) {
                toastr.success(response.message);
                loadFoods();
            },
            error: function(xhr) {
                const response = JSON.parse(xhr.responseText);
                toastr.error(response.message || 'Có lỗi xảy ra khi cập nhật trạng thái.');
            }
        });
    });
}); 