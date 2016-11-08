/**
 * =============================================================================
 * ************   Menu 菜单   ************
 * =============================================================================
 */

mdui.Menu = (function () {

  /**
   * 默认参数
   */
  var DEFAULT = {
    fixed: false,             // 是否使菜单固定在窗口，不随滚动条滚动
    covered: 'auto',          // 菜单是否覆盖在触发它的元素上，true、false。auto 时简单菜单覆盖，级联菜单不覆盖
    position: 'auto',         // 菜单位置 top、bottom、center、auto
    align: 'auto',            // 菜单和触发它的元素的对齐方式 left、right、center、auto
    gutter: 16,               // 菜单距离窗口边缘的最小距离，单位 px
    subMenuTrigger: 'hover',  // 子菜单的触发方式 hover、click
    subMenuDelay: 200,        // 子菜单的触发延时，仅在 submenuTrigger 为 hover 有效
  };

  /**
   * 类名
   */
  var CLASS = {
    menu: 'mdui-menu',                // 菜单基础类
    cascade: 'mdui-menu-cascade',     // 级联菜单
    open: 'mdui-menu-open',           // 打开状态的菜单
    item: 'mdui-menu-item',           // 菜单条目
  };

  /**
   * 调整主菜单位置
   * @param _this 实例
   */
  var readjust = function (_this) {
    var menuLeft;
    var menuTop;
    var position;
    var align;
    var windowHeight = window.innerHeight;
    var windowWidth = document.body.clientWidth;
    var gutter = _this.options.gutter;
    var isCovered = _this.isCovered;

    var transformOriginX;
    var transformOriginY;

    // 菜单宽度高度
    var menuWidth = parseFloat($.getStyle(_this.menu, 'width'));
    var menuHeight = parseFloat($.getStyle(_this.menu, 'height'));

    // 触发元素的宽度高度
    var anchorWidth = parseFloat($.getStyle(_this.anchor, 'width'));
    var anchorHeight = parseFloat($.getStyle(_this.anchor, 'height'));

    // 触发元素的位置
    var anchorOffset = $.offset(_this.anchor);

    // ===============================
    // ================= 自动判断菜单位置
    // ===============================
    if (_this.options.position === 'auto') {
      var bottomHeightTemp = windowHeight - anchorOffset.offsetTop - anchorHeight;
      var topHeightTemp = anchorOffset.offsetTop;

      // 判断下方是否放得下菜单
      if (bottomHeightTemp + (isCovered ? anchorHeight : 0) > menuHeight + gutter) {
        position = 'bottom';
      }

      // 判断上方是否放得下菜单
      else if (topHeightTemp + (isCovered ? anchorHeight : 0) > menuHeight + gutter) {
        position = 'top';
      }

      // 上下都放不下，居中显示
      else {
        position = 'center';
      }
    } else {
      position = _this.options.position;
    }

    // ===============================
    // ============== 自动判断菜单对齐方式
    // ===============================
    if (_this.options.align === 'auto') {
      var leftWidthTemp = anchorOffset.offsetLeft;
      var rightWidthTemp = windowWidth - anchorOffset.offsetLeft - anchorWidth;

      // 判断右侧是否放得下菜单
      if (rightWidthTemp + anchorWidth > menuWidth + gutter) {
        align = 'left';
      }

      // 判断左侧是否放得下菜单
      else if (leftWidthTemp + anchorWidth > menuWidth + gutter) {
        align = 'right';
      }

      // 左右都放不下，居中显示
      else {
        align = 'center';
      }
    } else {
      align = _this.options.align;
    }

    // ===============================
    // ==================== 设置菜单位置
    // ===============================
    if (position === 'bottom') {
      transformOriginY = '0';
      menuTop = (_this.options.fixed ? anchorOffset.offsetTop : anchorOffset.top) +
        (isCovered ? 0 : anchorHeight);
    } else if (position === 'top') {
      transformOriginY = '100%';
      menuTop = (_this.options.fixed ? anchorOffset.offsetTop : anchorOffset.top) -
        menuHeight + (isCovered ? anchorHeight : 0);
    } else {
      transformOriginY = '50%';

      // =====================在窗口中居中
      menuTop = (_this.options.fixed ? 0 : (anchorOffset.top - anchorOffset.offsetTop)) +
        (windowHeight - menuHeight) / 2;
    }

    _this.menu.style.top = menuTop + 'px';

    // ===============================
    // ================= 设置菜单对齐方式
    // ===============================
    if (align === 'left') {
      transformOriginX = '0';
      menuLeft = _this.options.fixed ? anchorOffset.offsetLeft : anchorOffset.left;
    } else if (align === 'right') {
      transformOriginX = '100%';
      menuLeft = (_this.options.fixed ? anchorOffset.offsetLeft : anchorOffset.left) +
        anchorWidth - menuWidth;
    } else {
      transformOriginX = '50%';

      //=======================在窗口中居中
      // 显示的菜单的宽度，菜单宽度不能超过窗口宽度
      var menuWidthTemp;

      // 菜单比窗口宽，限制菜单宽度
      if (menuWidth + gutter * 2 > windowWidth) {
        menuWidthTemp = windowWidth - gutter * 2;
        _this.menu.style.width = menuWidthTemp + 'px';
      } else {
        menuWidthTemp = menuWidth;
      }

      menuLeft = (_this.options.fixed ? 0 : anchorOffset.left - anchorOffset.offsetLeft) +
        (windowWidth - menuWidthTemp) / 2;
    }

    _this.menu.style.left = menuLeft + 'px';

    // 设置菜单动画方向
    $.transformOrigin(_this.menu, transformOriginX + ' ' + transformOriginY);
  };

  /**
   * 调整子菜单的位置
   * @param submenu
   */
  var readjustSubmenu = function (submenu) {
    var item = $.parent(submenu, '.' + CLASS.item);

    var submenuTop;
    var submenuLeft;
    var position; // top、bottom
    var align; // left、right
    var windowHeight = window.innerHeight;
    var windowWidth = document.body.clientWidth;

    var transformOriginX;
    var transformOriginY;

    // 菜单的宽度高度
    var submenuWidth = parseFloat($.getStyle(submenu, 'width'));
    var submenuHeight = parseFloat($.getStyle(submenu, 'height'));

    // 触发子菜单的菜单项的宽度高度
    var itemWidth = parseFloat($.getStyle(item, 'width'));
    var itemHeight = parseFloat($.getStyle(item, 'height'));

    // 触发子菜单的菜单项的位置
    var itemOffset = $.offset(item);

    // ===================================
    // ===================== 判断菜单上下位置
    // ===================================
    var bottomHeightTemp = windowHeight - itemOffset.offsetTop;
    var topHeightTemp = itemOffset.offsetTop + itemHeight;

    // 判断下方是否放得下菜单
    if (bottomHeightTemp > submenuHeight) {
      position = 'bottom';
    }

    // 判断上方是否放得下菜单
    else if (topHeightTemp > submenuHeight) {
      position = 'top';
    }

    // 默认放在下方
    else {
      position = 'bottom';
    }

    // ====================================
    // ====================== 判断菜单左右位置
    // ====================================
    var leftWidthTemp = itemOffset.offsetLeft;
    var rightWidthTemp = windowWidth - itemOffset.offsetLeft - itemWidth;

    // 判断右侧是否放得下菜单
    if (rightWidthTemp > submenuWidth) {
      align = 'left';
    }

    // 判断左侧是否放得下菜单
    else if (leftWidthTemp > submenuWidth) {
      align = 'right';
    }

    // 默认放在右侧
    else {
      align = 'left';
    }

    // ===================================
    // ======================== 设置菜单位置
    // ===================================
    if (position === 'bottom') {
      transformOriginY = '0';
      submenuTop = '0';
    } else if (position === 'top') {
      transformOriginY = '100%';
      submenuTop = -submenuHeight + itemHeight;
    }

    submenu.style.top = submenuTop + 'px';

    // ===================================
    // ===================== 设置菜单对齐方式
    // ===================================
    if (align === 'left') {
      transformOriginX = '0';
      submenuLeft = itemWidth;
    } else if (align === 'right') {
      transformOriginX = '100%';
      submenuLeft = -submenuWidth;
    }

    submenu.style.left = submenuLeft + 'px';

    // 设置菜单动画方向
    $.transformOrigin(submenu, transformOriginX + ' ' + transformOriginY);
  };

  /**
   * 打开子菜单
   * @param submenu
   */
  var openSubMenu = function (submenu) {
    readjustSubmenu(submenu);
    submenu.classList.add(CLASS.open);
  };

  /**
   * 关闭子菜单，及其嵌套的子菜单
   * @param submenu
   */
  var closeSubMenu = function (submenu) {
    submenu.classList.remove(CLASS.open);

    var submenus = $.queryAll('.' + CLASS.menu, submenu);
    $.each(submenus, function (i, tmp) {
      tmp.classList.remove(CLASS.open);
    });
  };

  /**
   * 切换子菜单状态
   * @param submenu
   */
  var toggleSubMenu = function (submenu) {
    if (submenu.classList.contains(CLASS.open)) {
      closeSubMenu(submenu);
    } else {
      openSubMenu(submenu);
    }
  };

  /**
   * 绑定子菜单事件
   * @param inst 实例
   */
  var bindSubMenuEvent = function (inst) {
    var trigger;
    var delay;

    if (mdui.support.touch) {
      trigger = 'touchstart';
      delay = 0;
    } else {
      if (inst.options.subMenuTrigger === 'hover') {
        trigger = 'mouseover';
        delay = inst.options.subMenuDelay;
      } else {
        trigger = 'click';
        delay = 0;
      }
    }

    if (trigger === 'click' || trigger === 'touchstart') {
      $.on(inst.menu, trigger, '.' + CLASS.item, function (e) {
        var _this = this;

        // 阻止冒泡
        if ($.parents(e.target, '.' + CLASS.item)[0] !== _this) {
          return;
        }

        var submenu = $.child(_this, '.' + CLASS.menu);

        // 先关闭除当前子菜单外的所有同级子菜单
        var menu = $.parent(_this, '.' + CLASS.menu);
        var items = $.children(menu, '.' + CLASS.item);
        $.each(items, function (i, item) {
          var tmpSubmenu = $.child(item, '.' + CLASS.menu);
          if (tmpSubmenu) {
            if (!submenu) {
              closeSubMenu(tmpSubmenu);
            } else if (!$.is(tmpSubmenu, submenu)) {
              closeSubMenu(tmpSubmenu);
            }
          }
        });

        // 切换当前子菜单
        if (submenu) {
          toggleSubMenu(submenu);
        }
      });
    } else if (trigger === 'mouseover') {
      $.on(inst.menu, trigger, '.' + CLASS.item, function () {
        var _this = this;
        var submenu = $.child(_this, '.' + CLASS.menu);

        console.log(submenu);
      });
    }
  };

  /**
   * 菜单
   * @param anchorSelector 点击该元素触发菜单
   * @param menuSelector 菜单
   * @param opts 配置项
   * @constructor
   */
  function Menu(anchorSelector, menuSelector, opts) {
    var _this = this;

    // 触发菜单的元素
    _this.anchor = $.dom(anchorSelector)[0];

    // 已通过自定义属性实例化过，不再重复实例化
    var oldInst = $.getData(_this.anchor, 'mdui.menu');
    if (oldInst) {
      return oldInst;
    }

    _this.menu = $.dom(menuSelector)[0];
    _this.options = $.extend(DEFAULT, (opts || {}));
    _this.state = 'closed';

    if (_this.options.fixed) {
      _this.menu.style.position = 'fixed';
    }

    // 是否是级联菜单
    _this.isCascade = !!_this.menu.classList.contains(CLASS.cascade);

    // covered 参数处理
    if (_this.options.covered === 'auto') {
      _this.isCovered = !_this.isCascade;
    } else {
      _this.isCovered = _this.options.covered;
    }

    // 点击触发菜单切换
    $.on(_this.anchor, 'click', function () {
      _this.toggle();
    });

    // 点击菜单外面区域关闭菜单
    $.on(document, 'click', function (e) {
      if (
        (_this.state === 'opening' || _this.state === 'opened') &&
        !$.is(e.target, _this.menu) &&
        !$.isChild(e.target, _this.menu) &&
        !$.is(e.target, _this.anchor) &&
        !$.isChild(e.target, _this.anchor)
      ) {
        _this.close();
      }
    });

    // 点击不含子菜单的菜单条目关闭菜单
    /*$.on(document, 'click', '.' + CLASS.item, function () {
      if (!$.query('.' + CLASS.menu, this)) {
        _this.close();
      }
    });*/

    // 绑定点击含子菜单的条目的事件
    bindSubMenuEvent(_this);

    // 窗口大小变化时，重新调整菜单位置
    $.on(window, 'resize', mdui.throttle(function () {
      readjust(_this);
    }, 100));
  }

  /**
   * 切换菜单状态
   */
  Menu.prototype.toggle = function () {
    var _this = this;

    if (_this.state === 'opening' || _this.state === 'opened') {
      _this.close();
    } else if (_this.state === 'closing' || _this.state === 'closed') {
      _this.open();
    }
  };

  /**
   * 打开菜单
   */
  Menu.prototype.open = function () {
    var _this = this;

    if (_this.state === 'opening' || _this.state === 'opened') {
      return;
    }

    // 调整菜单位置
    readjust(_this);

    // 打开菜单
    _this.menu.classList.add(CLASS.open);
    _this.state = 'opening';
    $.pluginEvent('open', 'menu', _this, _this.menu);

    // 打开动画完成后
    $.transitionEnd(_this.menu, function () {

      // 如果打开动画结束前，菜单状态已经改变了，则不触发 opened 事件
      if (_this.state !== 'opening') {
        return;
      }

      _this.state = 'opened';
      $.pluginEvent('opened', 'menu', _this, _this.menu);
    });
  };

  /**
   * 关闭菜单
   */
  Menu.prototype.close = function () {
    var _this = this;
    if (_this.state === 'closing' || _this.state === 'closed') {
      return;
    }

    _this.menu.classList.remove(CLASS.open);
    _this.state = 'closing';
    $.pluginEvent('close', 'menu', _this, _this.menu);

    // 菜单开始关闭时，关闭所有子菜单
    $.each($.queryAll('.mdui-menu', _this.menu), function (i, submenu) {
      closeSubMenu(submenu);
    });

    // 关闭动画完成后
    $.transitionEnd(_this.menu, function () {

      // 如果关闭动画完成前，菜单状态又改变了，则不触发 closed 事件
      if (_this.state !== 'closing') {
        return;
      }

      _this.state = 'closed';
      $.pluginEvent('closed', 'menu', _this, _this.menu);

      // 关闭后，恢复菜单样式到默认状态
      _this.menu.style.top = '';
      _this.menu.style.left = '';
      _this.menu.style.width = '';
    });
  };

  return Menu;
})();
