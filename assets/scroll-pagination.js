(function ($) {

    var methods = {
        init: function (options) {
            options = $.extend({
                pageSize: 100,
                distanceDownload: 1000, //количесво пиксилей которое должно оставаться до конца списка, для запуска следушей части списка
                url: window.location.href,
                separatorId: '-',
                nameParam: 'notid'
            }, options);

            return this.each(function () {
                var $this = $(this);
                var data = $this.data('scrollPagination');

                if (!data) {
                    data = {active: true, load: false};

                    $(window).scroll(function () {
                        var data = $this.data('scrollPagination');
                        if (data.data.active && !data.data.load)
                        {
                            var top = $(window).scrollTop() + $(window).height(); //позиция нижнияя граница браузера
                            var bottonBlock = $this.outerHeight() + $this.offset().top; // позиция нижней границы всего блока


                            if (bottonBlock - top <= data.options.distanceDownload)
                            {
                                methods.load.apply($this);
                            }
                        }

                    });

                    $this.data('scrollPagination', {
                        target: $this,
                        data: data,
                        options: options
                    });
                }
            });
        },
        load: function () {
            var $this = this.eq(0);
            var data = $this.data('scrollPagination');
            var ids = [];
            $this.find('[data-key]').each(function () {
                ids.push($(this).attr('data-key'));
            });
            var params = {};
            params[data.options.nameParam] = ids.join(data.options.separatorId);
            if (!data.data.load && data.data.active)
            {
                $.ajax({
                    type: "GET",
                    url: data.options.url,
                    data: params,
                    // dataType:'html',
                    beforeSend: function (xhr) {
                        data.data.load = xhr;
                        $this.trigger('load-start');
                    },
                    complete: function (jqXHR, textStatus) {
                        data.data.load = false;
                        $this.trigger('load-complete');
                    },
                    success: function (html) {
                        $this.append(html);
                        $this.trigger('loadPart');
                        if (html === '')
                        {
                            methods.noactive.apply($this);
                        }
                    }
                });
            }
        },
        update: function (url, updateUrl) {
            updateUrl = updateUrl === undefined ? true : false;

            var $this = this.eq(0);
            var data = $this.data('scrollPagination');
            if (updateUrl)
            {
                data.options.url = url;
            }
            data.data.active = true;
            if (data.data.load)
            {
                data.data.load.abort();
                data.data.load = false;
            }


            $.ajax({
                type: "GET",
                url: url,
                beforeSend: function (xhr) {
                    data.data.load = xhr;
                    $this.trigger('load-start');
                },
                complete: function (jqXHR, textStatus) {
                    data.data.load = false;
                    $this.trigger('load-complete');
                },
                success: function (html) {
                    $this.html(html);
                }
            });

        },
        noactive: function ()
        {
            var $this = this.eq(0);
            var data = $this.data('scrollPagination');
            data.data.active = false;
        }
    };

    $.fn.scrollPagination = function (method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Метод с именем ' + method + ' не существует для jQuery.scrollPagination');
        }

    };
})(jQuery);