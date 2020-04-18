(function($, app) {
    "use strict";
    var instance = new function() {

        this.init = function(options) {
            opt = $.extend(true, opt, options);
            bindElement();
            bindAction();
        };

        var bindAction = function() {
            calPadding();
            handeDragNDrop();
            slider();
            confirmHandle();
        };

        var slider = function() {
            $ele.slider.slider({
                max: 100,
                min: 0,
                create: function() {
                    $('#min-text').appendTo($('#slider-cf span').get(0));
                },
                slide: function(event, ui){
                    $(ui.handle).find('span').html(ui.value);
                }
               

            })
        }

        var calPadding = function() {
            return;
            var dropH = $ele.dropZone.height();

            var wH = $(window).height();
            var buttonH = $('.wrap-btn-confirm').height() + 10;
            var paddingH = wH - dropH - 100 - 10 - 20 - buttonH;
            $('.wrap-suspects').css('padding-bottom', paddingH + 'px');
        };

        var confirmHandle = function(){
            $ele.btnCf.click(function(){
                var point = $ele.slider.slider( "option", "value" );
                $ele.modal.modal('hide');
            });
        };

        var bindElement = function() {
            $ele.suspect = $('.suspect-item');
            $ele.suspectImg = $('.img-suspect');
            $ele.dropZone = $('.dropable-item');
            $ele.slider = $('#slider-cf');
            $ele.btnCf = $('.btn-confirm');
            $ele.modal = $('#confirm-modal');
            $ele.btnModal = $('.btn-modal');
            $ele.detailModal = $('#detail-modal');
            $ele.modalMainImg = $('.modal-main-image');
            $ele.modalMainInfo = $('.modal-main-info');
            $ele.lstImageModal = $('.list-image-modal');
            $ele.dropZone.css('height', '120px');
        };

        var getCoordinate = function($ele){
            var coor = $ele.offset();
            var bottom = $(window).height() - coor.top - $ele.height() - $('#grad1').height();
            coor.left = Math.round(coor.left, 3);
            bottom = Math.round(bottom, 3);
            return {
                x: coor.left,
                y: bottom,
            };
        }

        var showCoordinate = function(){
            $('.img-suspect-droped').hover(function(){
                var $this = $(this);
                var id = $this.data('id');

                var coor = getCoordinate($this);
                $this.attr('title', 'Image: '+id+ ' X: '+coor.x+', Y: '+ coor.y);
            });

            // $('.img-suspect-droped').off('click');
            $('.img-suspect-droped').click(function(){
                var tmpRow = `
                    <div class="col-md-3">
                        <div>
                        <img src="{src}" width="100" />
                        <p><b>{imagename}</b></p>
                        <p>X: {x}, Y: {y}</p>
                        </div>
                    </div>
                `;
                var html = '';
                var tmpHtml = [];
                var $this = $(this);
                var id = $this.data('id');
                var coor = getCoordinate($this);
                $ele.detailModal.modal('show');
                var src = $this.attr('src');

                 html += (app.f(tmpRow, {
                    src: src,
                    imagename: 'Image '+id,
                    x: coor.x,
                    y: coor.y,
                }));
                var lstSamePoint = [];

                $.each(collidingGroup, function(idx, group){
                    if(group.indexOf(id) !== -1){
                        lstSamePoint = collidingGroupEle[idx];
                        return false;
                    }
                });
                $.each(lstSamePoint, function(idx, item){
                    var tmpid = item.data('id');
                    if(id == tmpid) return true;
                    var tmpcoor = getCoordinate(item);
                    var src = item.attr('src');
                    html += (app.f(tmpRow, {
                        src: src,
                        imagename: 'Image '+tmpid,
                        x: tmpcoor.x,
                        y: tmpcoor.y,
                    }));
                })


                $ele.lstImageModal.html(html);

            });

        };

        var is_colliding = function( $div1, $div2 ) {
            $div1 = $($div1);
            $div2 = $($div2);

            
            // Div 1 data
            var d1_offset             = $div1.offset();
            var d1_height             = $div1.outerHeight( true );
            var d1_width              = $div1.outerWidth( true );
            var d1_distance_from_top  = d1_offset.top + d1_height;
            var d1_distance_from_left = d1_offset.left + d1_width;

            // Div 2 data
            var d2_offset             = $div2.offset();
            var d2_height             = $div2.outerHeight( true );
            var d2_width              = $div2.outerWidth( true );
            var d2_distance_from_top  = d2_offset.top + d2_height;
            var d2_distance_from_left = d2_offset.left + d2_width;

            var not_colliding = ( d1_distance_from_top < d2_offset.top || d1_offset.top > d2_distance_from_top || d1_distance_from_left < d2_offset.left || d1_offset.left > d2_distance_from_left );
            // Return whether it IS colliding
            return ! not_colliding;
        };

        var groupColliding = function(){
            collidingGroup = [];
            collidingGroupEle = [];
            var l = $('.img-suspect-droped').length;

            for (var i = 0; i < l; i++) {
                var $first = $('.img-suspect-droped')[i];
                $first = $($first);
                var idSuspect = $first.data('id');
                for (var j = i+1; j < l; j++) {
                    var $scond = $('.img-suspect-droped')[j];
                    $scond = $($scond);
                    var idSuspect2 = $scond.data('id');
                    var idColliding = is_colliding($first, $scond);

                    if(idColliding){
                        var flag1 = false;
                        // $.each(collidingGroup, function(idx, g){

                        //     if(g.indexOf(idSuspect) === -1){

                        //         collidingGroup[idx].push(idSuspect);
                        //         collidingGroupEle[idx].push($first);
                        //         flag1 = true;
                        //         return false;
                        //     }
                        // });
                        if(!flag1){
                            var lent = collidingGroup.length;
                            collidingGroup.push([idSuspect]);
                            collidingGroupEle.push([$first]);
                        }
                       

                        $.each(collidingGroup, function(idx, g){
                            if(g.indexOf(idSuspect2) === -1 && g.indexOf(idSuspect) !== -1){
                                collidingGroup[idx].push(idSuspect2);
                                collidingGroupEle[idx].push($scond);
                                return false;
                            }
                        });

                         console.log(collidingGroup);
                    }
                   
                }
                
            }

            arranceEleCollding();
        };
        function arrayRotate(arr, reverse) {
          if (reverse) arr.unshift(arr.pop());
          else arr.push(arr.shift());
          return arr;
        }
        var arranceEleCollding = function(){
            cacheGroupColl = {};
            $.each(collidingGroupEle, function(idx, group){

                cacheGroupColl[idx] = {
                    'turn': 1,
                };
                var lstZindex = [];
                $.each(group, function(i, item){
                    var zIndex = item.css('z-index');
                    lstZindex.push(zIndex);
                }) 

                if(typeof cacheGroupColl[idx].lstZindex === 'undefined'){
                    cacheGroupColl[idx].lstZindex = lstZindex;
                }
                if(cacheGroupColl[idx].timer){
                    clearInterval(cacheGroupColl[idx].timer);
                }

                cacheGroupColl[idx].timer = setInterval(function(){
                    cacheGroupColl[idx].lstZindex = arrayRotate(cacheGroupColl[idx].lstZindex);
                    $.each(group, function(i, item){
                        var zIndex = cacheGroupColl[idx].lstZindex[i];
                        item.css('z-index', zIndex);
                    })  

                }, 3000);

            });
        }

        var handeDragNDrop = function() {

            $ele.suspectImg.draggable({
                revert: "invalid",
                stack: ".img-suspect",
                scroll: false,
                scope: "tasks",


                // helper: 'clone'
            });
            $ele.dropZone.droppable({
                accept: ".img-suspect",
                scope: "tasks",
                drop: function(event, ui) {
                    $(this).removeClass("on-over");

                    var droppable = $(this);
                    var draggable = ui.draggable;

                    var likely = droppable.data('likely');
                    var suspect = draggable.data('id');

                    draggable.addClass('img-suspect-droped');

                    $.each(likelySave, function(k, lstSus) {
                        likelySave[k] = jQuery.grep(likelySave[k], function(value) {
                            return value != suspect;
                        });
                    })

                    if (typeof likelySave[likely] == 'undefined')
                        likelySave[likely] = [];
                    likelySave[likely].push(suspect);
                    $ele.btnModal.prop('disabled', true);
                    if(typeof likelySave[1] !== 'undefined' && likelySave[1].length)
                        $ele.btnModal.prop('disabled', false);
                    showCoordinate();
                    groupColliding();
                },
                over: function(event, ui) {
                    $(this).addClass("on-over")
                },
                out: function() {
                    $(this).removeClass("on-over")
                }
            });
        };






        var opt;
        var self = this;
        var $ele = {};
        var suspects = {};
        var likelySave = {};
        var collidingGroupEle = [];
        var collidingGroup = [];
        var cacheGroupColl = {};
    }
    app.addCls('suspect', instance);
})($, $.app);