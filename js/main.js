(function() {

    var __extends = function(child, parent) {
        for (var key in parent) {
            if (Object.prototype.hasOwnProperty.call(parent, key))
                child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor;
        child.__super__ = parent.prototype;
        return child;
    };

    window.Popup = (function() {

        var o;

        function Popup() {
            o = this;
        }

        Popup.prototype.open = function(popup, text, onClose) {
            if ($('.popup.' + popup).length) {
                $('.overlay').show();

                var top = $(window).height() / 2 + $(document).scrollTop() - $('.popup.' + popup).outerHeight() / 2;
                if (top < 0)
                    top = 5;
                $('.popup.' + popup).css('margin-top', top);

                if (text)
                    $('.popup.' + popup + ' p').html(text);

                $('.popup.' + popup + ' .close').unbind('click');

                if (onClose) {
                    if (typeof onClose === 'function') {
                        $('.popup.' + popup + ' .close').click(function(e) {
                            e.preventDefault();
                            onClose();
                        });
                    }
                } else {
                    $('.popup.' + popup + ' .close').click(function(e) {
                        e.preventDefault();
                        o.close(popup);
                    });
                }

                $('.popup.' + popup).fadeIn('fast');
            }
        };

        Popup.prototype.close = function(popup) {

            if (popup)
                $('.popup.' + popup).fadeOut('fast');
            else
                $('.popup').fadeOut('fast');
            $('.overlay').hide();
        };

        return Popup;

    })();

    window.FBHelper = (function() {

        var o, priv = {
            accessToken: null
        };

        function FBHelper() {
            o = this;
        }

        FBHelper.prototype.getAccessToken = function() {
            return priv.accessToken;
        };

        FBHelper.prototype.login = function(cb, scope) {
            if (priv.accessToken)
                return;
            FB.login(function() {
                FB.getLoginStatus(function(response) {
                    if (response.status == 'connected') {
                        priv.accessToken = response.authResponse.accessToken;
                        cb();
                    }
                });
            }, {
                scope: scope
            });
        };

        return FBHelper;

    })();

    window.Page = (function( /*url, facebookId, accessToken*/ ) {
        /*
          priv.appUrl = url;
          priv.facebookId = facebookId;
          priv.accessToken = accessToken;
        */

        var o, priv = {};

        function Page() {
            this.Access = new Access();
            o = this;
            priv.init();
        }

        Page.prototype.Popup = new Popup();
        Page.prototype.FBHelper = new FBHelper();

        priv.init = function() {
            var that = this;

            $('.share').click(function() {
                FB.ui({
                    method: 'feed',
                    name: 'App name',
                    link: 'http://tinyurl.com/link_name',
                    caption: 'caption',
                    description: 'description',
                    picture: 'picture_url'
                });
            });
        };

        /*
        // Ha keretappos
        $('.user-data').attr('href', 'https://fbapps.reongroup.hu/keretapp_teszt/index?facebookId=' + priv.facebookId + '&accessToken=' + priv.accessToken + '&userData=1');
        $('.reporter').attr('href', 'https://fbapps.reongroup.hu/keretapp_teszt/index?facebookId=' + priv.facebookId + '&accessToken=' + priv.accessToken + '&report=1');

        $.post('/keretapp_teszt/index/index/checkacceptedterms', {

            facebook_id: priv.facebookId,
            game: 'school'

        }, function(response) {

            if (response) {
                priv.logged = true;
                $('.agreement .checkbox').hide();
            }
            priv.showPanel('agreement');

        }, 'json');

        $('.js-agreement').on('click', function() {

            if (priv.logged) {
                priv.hidePanel('agreement', function() {
                    priv.showPanel('description');
                });
                return;
            }

            if (!$('#checkboxG2:checked').length) {

                $('[for="checkboxG2"]').addClass('error');

            } else {
                $.post('/keretapp_teszt/index/index/saveterms', {

                    facebook_id: priv.facebookId,
                    agreed: 1,
                    newsletter: $('[name="newsletter"]:checked').length,
                    game: 'school'

                }, function(response) {

                    if (response.success) {
                        priv.hidePanel('agreement', function() {
                            priv.showPanel('description');
                        });
                    }

                });
            }
        });
        */

        priv.hidePanel = function(panel, callback) {
            $('.panel.' + panel).fadeOut(300, function() {
                if (typeof callback == 'function' && !$('.panel.' + panel + ':animated').length)
                    callback();
            });
        }

        priv.hideVisiblePanel = function(callback) {
            priv.prevPanel = $('.panel:visible');
            $('.panel:visible').fadeOut(300, function() {
                if (typeof callback == 'function' && !$('.panel:animated').length)
                    callback();
            });
        }

        priv.showPanel = function(panel, callback) {
            $('.panel.' + panel).fadeIn(300, function() {
                if (typeof callback == 'function' && !$('.panel.' + panel + ':animated').length)
                    callback();
            });
        }

        priv.showPreviousPanel = function(callback) {
            priv.prevPanel.fadeIn(300, function() {
                if (typeof callback == 'function' && !priv.prevPanel.is(':animated').length)
                    callback();
            });
        }

        return Page;

    })();

    window.Access = (function(_super) {

        __extends(Access, _super);

        var o, priv = {};

        function Access() {
            o = this;
            priv.init();
        }

        priv.init = function() {
            var that = this;

            $("form").submit(function(e) {
                e.preventDefault();
                that.submit(this);
            });
        }

        //  Form validation
        priv.submit = function(parameter) {
            $(parameter).ajaxSubmit({
                url: '/teszt/index/test/submit',
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        console.log('success');
                    } else
                        priv.showErrors(response.errors);
                }
            });
        }

        $('input, textarea, select').on('focus', function() {
            $(this).removeClass('error').closest('div').find('.wrong').remove();
        });

        priv.showErrors = function(errors) {
            $('.error').text('').hide();
            for (var i in errors) {
                $('.error', $('[name="' + i + '"]').parent()).text(errors[i]).show();
            }
        };

        return Access;

    })(Page);

})();
/* Ha kell
var b = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    e: function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = b._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }
        return output;
    },
    _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }
}
*/
