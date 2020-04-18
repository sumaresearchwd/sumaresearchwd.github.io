$.ajaxQ = (function() {
    var id = 0,
        Q = {};

    $(document).ajaxSend(function(e, jqx) {
        jqx._id = ++id;
        Q[jqx._id] = jqx;
    });
    $(document).ajaxComplete(function(e, jqx) {
        delete Q[jqx._id];
    });

    return {
        abortAll: function() {
            var r = [];
            $.each(Q, function(i, jqx) {
                r.push(jqx._id);
                jqx.abort();
            });
            return r;
        },
        abortById: function(id) {
            if (Q[id]) Q[id].abort();
        }
    };

})();

function addPrototype() {
    //String replace all
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(elt /*, from*/ ) {
            var len = this.length;
            elt = parseInt(elt, 10);
            var from = Number(arguments[1]) || 0;
            from = (from < 0) ?
                Math.ceil(from) :
                Math.floor(from);
            if (from < 0)
                from += len;

            for (; from < len; from++) {
                if (from in this &&
                    this[from] === elt)
                    return from;
            }
            return -1;
        };
    }

    // Replaces all instances of the given substring.
    String.prototype.replaceAll = function(strTarget, strSubString) {
        var strText = this;
        var intIndexOfMatch = strText.indexOf(strTarget);
        while (intIndexOfMatch != -1) {
            strText = strText.replace(strTarget, strSubString)
            intIndexOfMatch = strText.indexOf(strTarget);
        }
        return (strText);
    };

    String.prototype.replaceArray = function(find, replace) {
        var replaceString = this;
        var regex;
        for (var i = 0; i < find.length; i++) {
            regex = new RegExp(find[i], "g");
            replaceString = replaceString.replace(regex, replace[i]);
        }
        return replaceString;
    };

    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    Array.prototype.last = function() {
        return this[this.length - 1]
    };
    
    Array.prototype.findInKey = function(a, b) {
        for (var c = 0; c < this.length; c++)
            if (this[c][a] == b) return c;
        return null
    };
    Array.prototype.findAllInKey = function(a, b) {
        for (var c = [], d = 0; d < this.length; d++) this[d][a] && this[d][a] == b && c.push(this[d]);
        return c
    };
    Array.prototype.contains = function(a) {
        return this.find(a) != null
    };
    Array.prototype.containsAny = function(items) {
        for (var i = 0; i < items.length; i++) {
            if (this.contains(items[i])) return true;
        }

        return false;
    };
    Array.prototype.pushUnique = function(a, b) {
        b != void 0 && b == false ? this.push(a) : this.find(a) == null && this.push(a)
    };
    Array.prototype.unique = function() {
        var r = new Array();
        o: for (var i = 0, n = this.length; i < n; i++) {
            for (var x = 0, y = r.length; x < y; x++) {
                if (r[x] == this[i]) {
                    continue o;
                }
            }
            r[r.length] = this[i];
        }
        return r;
    };

    Array.prototype.pushArray = function(a) {
        for (var b = 0; b < a.length; ++b) this.push(a[b])
    };

    Array.prototype.insert = function(index, item) {
        this.splice(index, 0, item);
    };

    Array.prototype.equals = function(array) {
        return this.length == array.length &&
            this.every(function(this_i, i) {
                return this_i == array[i]
            })
    };

    Array.prototype.remove = function(value) {
        var idx = this.indexOf(value);
        if (idx !== -1) this.splice(idx, 1);
        return true;
    };

    Array.prototype.getInKey = function(a, b) {
        for (var c = 0; c < this.length; c++)
            if (this[c][a] == b) return this[c];
        return null
    };

    Array.prototype.minByKey = function(k) {
        if (!this.length) return null;
        this.sort(function(a, b) {
            return a[k] - b[k]
        });
        return this[0];
    };

    $.fn.outerHTML = function() {
        return $('<div />').append(this.eq(0).clone()).html();
    };

    $.fn.refresh = function() {
        return $(this.selector);
    };

    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    $.fn.alterClass = function(removals, additions) {
        var self = this;
        if (removals.indexOf('*') === -1) {
            // Use native jQuery methods if there is no wildcard matching
            self.removeClass(removals);
            return !additions ? self : self.addClass(additions);
        }

        var patt = new RegExp('\\s' +
            removals.replace(/\*/g, '[A-Za-z0-9-_]+').split(' ').join('\\s|\\s') +
            '\\s', 'g');
        self.each(function(i, it) {
            var cn = ' ' + it.className + ' ';
            while (patt.test(cn)) {
                cn = cn.replace(patt, ' ');
            }
            it.className = $.trim(cn);
        });

        return !additions ? self : self.addClass(additions);
    };

    $.fn.showTooltip = function(opt) {
        return this.tooltip(opt).on('show.bs.tooltip', function() {
            $('.tooltip').not(this).hide();
        }).on('hide.bs.tooltip', function() {
            $('.tooltip').show();
        });
    };

    $.fn.enterKey = function(fnc) {
        return this.each(function() {
            $(this).keypress(function(ev) {
                var keycode = (ev.keyCode ? ev.keyCode : ev.which);
                if (keycode == '13') {
                    fnc.call(this, ev);
                }
            })
        })
    }


    $.fn.loading = function() {
        var ele = `<div class="brd-overlay-loading" style=" z-index: 50;
                    background: rgba(255,255,255,0.7);
                    border-radius: 3px;position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;">
                    <i class="fa fa-refresh fa-spin" style="position: absolute;
                    top: 50%;
                    left: 50%;
                    margin-left: -15px;
                    margin-top: -15px;
                    color: #000;
                    font-size: 30px;"></i>
            </div>`;
        return this.each(function() {
            $(this).append(ele);
        })
    }
    $.fn.unloading = function() {
        return this.each(function() {
            $('.brd-overlay-loading', $(this)).remove();
        })
    }

    jQuery.fn.visible = function() {
        return this.css('visibility', 'visible');
    };

    jQuery.fn.invisible = function() {
        return this.css('visibility', 'hidden');
    };

    jQuery.fn.visibilityToggle = function() {
        return this.css('visibility', function(i, visibility) {
            return (visibility == 'visible') ? 'hidden' : 'visible';
        });
    };

}


(function($) {
    "use strict";
    $.app = new function() {
        addPrototype();
        var appRunCls = {};
        var appData;
        var interval = null;
        var instance = this;
        var _navigator = null;
        var _popStateEventCount = 0;
        var _loading = true;

        this.lang = {};
        this.vars = {};
        this.t = {};

        this.f = function(str, data) {
            return str.replace(/{([^{}]*)}/g,
                function(a, b) {

                    var r = data[b];
                    return typeof r === 'string' ? r : "" + r;
                }
            );
        };

        this.abortAll = function() {
            $.ajaxQ.abortAll();
        };

        this.abortById = function(id) {
            $.ajaxQ.abortById(id);
        }

        this.format = function(str, data) {
            var b = RegExp("(?:%(\\d+))", "mg"),
                c = 0,
                d = [];
            do {
                var e = b.exec(str);
                if (e && e[1]) {
                    e.index > c && d.push(str.substring(c, e.index));
                    d.push(data[parseInt(e[1])]);
                    c = b.lastIndex
                }
            } while (e);
            c < str.length && d.push(str.substring(c, str.length));
            return d.join("")
        };
        this.addCommas = function(nStr) {
            nStr += '';
            var x = nStr.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        };

        this.resetCls = function() {
            appRunCls = {};
        };

        this.addCls = function(name, cls) {
            name = name.toLowerCase().trim();
            if (!appRunCls[name]) appRunCls[name] = cls;
        };
        this.getCls = function(name) {
            name = name.toLowerCase().trim();
            return appRunCls[name];
        };

        this.init = function(args) {
            //Set vars
            for (var i in args) {
                if (args.hasOwnProperty(i)) {
                    instance.vars[i] = args[i];
                }
            }
            
            addPrototype();
            //Run app
            this.run();



        };

        this.inProgress = function() {
            return _loading;
        };


        this.pushNoti = function(type, msg, timeout) {

            return noty({
                layout: 'topCenter',
                modal: false,
                type: type,
                text: msg,
                timeout: timeout ? timeout : 3000
            });
        };

        this.pushConfirmNoti = function(msg, okCb, canCb) {

            return noty({
                text: msg,
                type: 'error',
                layout: 'center',
                modal: true,
                buttons: [{
                    addClass: 'btn btn-primary',
                    text: 'OK',
                    onClick: okCb
                }, {
                    addClass: 'btn btn-danger',
                    text: 'Cancel',
                    onClick: canCb
                }]
            });
        };

        this.run = function() {
            $.each(appRunCls, function(index, data) {
                if (data.hasOwnProperty('run'))
                    data.run();
            });

            appRunCls = {};
        };

        //function to block element (indicate loading)
        this.blockUI = function(options) {
            var options = $.extend(true, {}, options);
            var html = '';
            if (options.iconOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="/assets/globals/img/loading-spinner-blue.gif" align=""></div>';
            } else if (options.textOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
            } else {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="/assets/globals/img/loading-spinner-blue.gif" align=""><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
            }

            if (options.target) { // element blocking
                var el = $(options.target);
                if (el.height() <= ($(window).height())) {
                    options.cenrerY = true;
                }
                el.block({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    centerY: options.cenrerY != undefined ? options.cenrerY : false,
                    css: {
                        top: '10%',
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#000',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait',
                        height: el.prop('scrollHeight') + 'px'
                    }
                });
            } else { // page blocking
                $.blockUI({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    css: {
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#000',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            }
        };

        //function to un-block element (finish loading)
        this.unblockUI = function(target) {
            if (target) {
                $(target).unblock({
                    onUnblock: function() {
                        //$(target).css('position', '');
                        $(target).css('zoom', '');
                    }
                });
            } else {
                $.unblockUI();
            }
        };

        //function to scroll(focus) to an element
        this.scrollTo = function(ele, offset) {
            var pos = (ele && ele.size() > 0) ? ele.offset().top : 0;

            if (ele) {
                if ($('body').hasClass('page-header-fixed')) {
                    pos = pos - $('.page-header').height();
                }
                pos = pos + (offset ? offset : -1 * ele.height());
            }

            $('html,body').animate({
                scrollTop: pos
            }, 'slow');
        };



        //function to make animate to an element
        this.animated = function(ele, type, loop, cb) {

            if (cb) ele.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
                cb(ele);
            });

            ele.addClass('animated');
            ele.addClass(type);

            if (!loop) {
                setTimeout(function(e, t) {
                    e.removeClass(t);
                }, 1000, ele, type);
            } else ele.addClass('animated-loop');
        };



        //Common ajax
        this.ajax = function(url, params, $ele, method, dataType, showLoading, onSuccess, onError, onComplete) {
            showLoading = (typeof showLoading === 'undefined' || showLoading === '') ? false : showLoading;
            method = (typeof(method) == 'undefined' || method == '' || (method.toUpperCase() != 'POST' && method.toUpperCase() != 'GET' && method.toUpperCase() != 'PUT' && method.toUpperCase() != 'DELETE')) ? 'GET' : method.toUpperCase();
            dataType = (typeof(dataType) == 'undefined' || dataType == '') ? 'html' : dataType;

            if (typeof(onSuccess) == 'undefined' || onSuccess == '') {
                var _onSucess = function(data) {
                    if (dataType.toLocaleLowerCase() == 'json') {
                        $ele.html(data.form);
                    } else {
                        $ele.html(data);
                    }
                };
            } else {
                var _onSucess = onSuccess;
            }

            if (typeof(onError) == 'undefined' || onError == '') {
                var _onError = function(jqXHR, textStatus, errorThrown) {

                    NProgress.done();
                    clearTimeout(interval);

                    if (textStatus != 'abort') alert('An error occurred! Please try again!');

                    try {
                        $ele.html("Sorry. There was an error.");
                    } catch (e) {
                        alert("Sorry. There was an error.");
                    }
                };
            } else {
                var _onError = onError;
            }

            var _onComplete = function(jqXHR, textStatus) {

                NProgress.done();
                clearTimeout(interval);

                if (typeof(onComplete) != 'undefined' && onComplete != '') {
                    onComplete(jqXHR, textStatus);
                }
            };

            if (showLoading) {

                if (interval) {
                    clearInterval(interval);
                    // NProgress.done();
                }

                //Set interval progress
                interval = setInterval(function() {
                    NProgress.inc();
                }, 200);
            }

            //Append CSRF Token

            var tokenName = this.vars.token_name;
            var tokenValue = this.vars.token_value;
            if (method.toUpperCase() == 'POST' || method.toUpperCase() == 'PUT' || method.toUpperCase() == 'DELETE') {
                if ($.isPlainObject(params) && params[tokenName] == undefined){
                    var ext = {};
                    ext[tokenName] = tokenValue;
                     params = $.extend(params, ext);
                }
                if (typeof(params) == 'string' && params.indexOf(tokenName) == -1) params += (params != '' ? '&' : '') + tokenName+ '=' + encodeURIComponent(tokenValue);
            }

            return $.ajax({
                type: method,
                url: url,
                dataType: dataType,
                data: params,
                success: _onSucess,
                error: _onError,
                complete: _onComplete,
            });
        };



        this.initTooltip = function(ele, c, t, p) {
            ele.tooltip({
                container: c,
                title: t,
                placement: p
            });

            ele.tooltip('show');
        };

       

        this.generate = function() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            return s4() + s4();
        };


        this.isInt = function(n) {
            return !isNaN(parseInt(n, 10)) && parseInt(n, 10) == n;
        };

        this.formatID = function(id) {
            return id ? id.replaceAll('.', '_') : this.generate();
        };

        this.addCleaner = function(cb) {
            cleaners.push(cb);
        };

        this.clean = function() {
            if (!cleaners.length) return;

            cleaners.forEach(function(cb) {
                cb();
            });

            cleaners = [];
        };


        this.applyActiveNav = function(){
            var currUrl = document.URL;
            var $liNav = $('.sidebar-menu  li');
            $liNav.each(function( index ) {
                var href = $('a', $( this )).attr('href');
                if(href && href.length > 2 && currUrl.indexOf(href) !== -1){
                    $( this ).addClass('active');

                    var parent = $(this).closest('ul');
                    if(parent.hasClass('treeview-menu')){
                        parent.closest('.treeview').addClass('active');
                    }

                    return false;
                }
            });
        };

        this.setCookie = function(name, value, days){
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days*24*60*60*1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "")  + expires + "; path=/";
        }

        this.getCookie = function(name){
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }

        this.detectmob = function() { 
             if( navigator.userAgent.match(/Android/i)
             || navigator.userAgent.match(/webOS/i)
             || navigator.userAgent.match(/iPhone/i)
             || navigator.userAgent.match(/iPad/i)
             || navigator.userAgent.match(/iPod/i)
             || navigator.userAgent.match(/BlackBerry/i)
             || navigator.userAgent.match(/Windows Phone/i)
             ){
                return true;
              }
             else {
                return false;
              }
        }

       
        this.toggleSideBar = function(){
            if(self.detectmob()) return;
            var $wrap = $('.brd-wrap-all');
           
            $('.toggle_left_nav').click(function () {
                $wrap.toggleClass('toggle');
                self.setCookie('sidebar_colslap_state', $wrap.hasClass('toggle'), 300);
                $(window).trigger('resize');
                
            });


            if(self.getCookie('sidebar_colslap_state')){
                 $wrap.toggleClass('toggle');
            }

            reCalContenWidth();

            $(window).resize(function(){
                reCalContenWidth();
            });

            bindTitleMenu();



        };

        var bindTitleMenu = function(){
            var $lefMenu = $('#adminmenu');
            $('.menu_name', $lefMenu).each(function(){
                var $a = $(this).closest('a');
                $('.icon-leftmenu', $a).attr('title', $.trim($(this).text()));
            });
        };

        var reCalContenWidth = function(){
            if(self.detectmob()) return;
            var sbW = $('#adminmenuwrap').width();
            sbW = parseInt(sbW);
            var docW = $(window).width();
            var cWidth = docW - sbW -32 - 30;
            $('#brd-main-content').css('width', cWidth+'px');
            $('#list_tags').css('width', cWidth+'px');

        }

        function movieFormatResult(movie) {
            var markup = "<table class='movie-result'><tr>";
            if (movie.posters !== undefined && movie.posters.thumbnail !== undefined) {
                markup += "<td class='movie-image'><img src='" + movie.posters.thumbnail + "'/></td>";
            }
            markup += "<td class='movie-info'><div class='movie-title'>" + movie.uName + "</div>";
            markup += "</td></tr></table>";
            return markup;
        }

        function movieFormatSelection(movie) {
            return movie.title;
        }


        var cleaners = [];
        var self = this;
    };


    return $.app;
})(jQuery)