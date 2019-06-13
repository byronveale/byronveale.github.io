;(function ( $, window, document, undefined ) {

	var pluginName = 'ik_menu',
		defaults = {
			'instructions': 'Use the tab key to leave this menu; the right and left or up and down arrow keys to navigate this menu; the escape key to close this menu; and the enter key to activate menu items.'
		};

	/**
	 * @constructs Plugin
	 * @param {Object} element - Current DOM element from selected collection.
	 * @param {Object} [options] - Configuration options.
	 */
	function Plugin( element, options ) {

		this._name = pluginName;
		this._defaults = defaults;
		this.element = $(element);
		this.options = $.extend( {}, defaults, options) ;

		this.init();
	}

	/** Initializes plugin. */
	Plugin.prototype.init = function () {

		var id, $elem, plugin;

		plugin = this;
		id = 'menu' + $('.ik_menu').length; // generate unique id
		$elem = plugin.element;

		$elem.addClass('ik_menu')
			.attr({
				'id': 'nav_' + id
			});

		$('<div/>') // add div element to be used with aria-described attribute of the menu
			.text(plugin.options.instructions) // get instruction text from plugin options
			.addClass('ik_readersonly') // hide element from visual display
			.attr({
				'id': id + '_instructions',
				'aria-hidden': 'true'  // hide element from screen readers to prevent it from being read twice
			})
			.appendTo(this.element);

		plugin.menubutton = $elem.find('button#menu_button')
			.attr({
				'tabindex': 0,
				'aria-controls': id,
				'aria-labelledby': id + '_instructions',
				'aria-expanded': false,
				'aria-hidden': false,
				'aria-haspopup': true,
				'role': 'button'
			});

		$elem.children('ul') // there will only be one child ul element
			.attr({
				'id': id,
				'role': 'menubar', // assign menubar role
				'tabindex': -1,
				'aria-hidden': true, // hide menu from screen reader
				'aria-haspopup': true,
				'aria-expanded': false
			})
			.addClass('expandable');

		plugin.menuitems = $elem.find('li') // setup menuitems
			.css({ 'list-style': 'none' })
			.each(function(i, el) {

				var $me, $link;

				$me = $(this);
				$link = $me.find('>a')
					.attr({ // disable links
						'tabindex': -1,
						'aria-hidden': true
					})
				;

				$me
					.attr({
						'role': 'menuitem', // assign menuitem rols
						'tabindex': -1,  // remove from tab order
						'aria-label': $link.text() // label with link text
					})
					.addClass('i-m-a-menuitem');

			});
/*
		plugin.selected = plugin.menuitems // setup selected menuitem
			.find('.selected')
			.attr({
				'tabindex': 0,
				'aria-selected': true
			})
		;

		if (plugin.selected.length) {

			plugin.menuitems
				.eq(0)
				.attr({
					'tabindex': 0
				})
			;

		} else {

			plugin.selected
				.parentsUntil('nav', 'ul')
				.attr({ // setup submenus
					'aria-expanded': true,
					'tabindex': 0
				})
				.addClass('expanded');
			;

		}
*/
		plugin.menuitems // setup event handlers
/*			.on('mouseenter', plugin.showSubmenu)
			.on('mouseleave', plugin.hideSubmenu)
*/			.on('click', {'plugin': plugin}, plugin.activateMenuItem)
			.on("keydown", {'plugin': plugin}, plugin.onKeyDown)
		;

/*		plugin.menubutton // setup event handlers
			.on('mouseenter', plugin.showMenu)
			.on('mouseleave', plugin.hideMenu)
			.on('click', {'plugin': plugin}, plugin.activateMenuItem)
			.on("keydown", {'plugin': plugin}, plugin.onKeyDown)
*/		;

		$('button#menu_button').on({
			focus: function(event){
				showMenuFunction(event);
			},
/*			focusout: function(event){
				hideMenuFunction(event);
			},
*/		});

		$('button#menu_button').keydown(function(event){

			var $me;

			$me = $(this);

			switch (event.which) {

				case 39: // Right arrow

					event.preventDefault();
					event.stopPropagation();

					$me
						.next('ul.looking-for')
						.addClass('reached-this')
						.children('li')
						.eq(0)
						.focus()
					;
/*					alert('Right arrow pressed');
*/
					break;

				case 40: // Down arrow

					event.preventDefault();
					event.stopPropagation();


					$me
						.next('ul.looking-for')
						.addClass('reached-this')
						.children('li')
						.eq(0)
						.focus()
					;
/*					alert('Down arrow pressed');
*/
					break;

				case 9: // Tab key

					event.stopPropagation();

					hideMenuFunction(event);

					break;

				case 27: // Escape key

					event.stopPropagation();

					hideMenuFunction(event);

					break;

				case 13: // Return key

					event.stopPropagation();

					if ($me.hasClass('expanded')) {
						hideMenuFunction(event);
					}
					else {
						showMenuFunction(event);
					}

					break;
			}
		});

		$('nav.ik_menu').on({
			mouseenter: function(event){
				showMenuFunction(event);
			},
			mouseleave: function(event){
				hideMenuFunction(event);
			},
		});

		/*
                $('button#menu_button').focus(function(event){
                    showMenuFunction(event);
                });

                $('button#menu_button').focusout(function(event){
                    hideMenuFunction(event);
                });

                $('button#menu_button').mouseenter(function(event){
                    showMenuFunction(event);
                });

                $('nav.ik_menu').mouseleave(function(event){
                    hideMenuFunction(event);
                });
        */
		$(window).on('resize', hideMenuFunction(event)); // collapse all submenues when window is resized

	};

	/**
	 * Shows submenu.
	 *
	 * @param {object} event - Mouse event.
	 */
/*	Plugin.prototype.showSubmenu = function(event) {

		var $elem, $submenu;

		$elem = $(event.currentTarget);
		$submenu = $elem.children('ul');

		if ($submenu.length) {
			$elem.addClass('expanded')
				.attr({
					'aria-expanded': true,
					'tabindex': -1
				})
			;
		}

		$submenu
			.attr({
				'aria-hidden': false
			});
	};
*/

	function showMenuFunction(event) {

		var $elem, $themenu, $menuitems;

		$elem = $('nav.ik_menu').children('button#menu_button');
		$themenu = $('button#menu_button').next('ul.looking-for');

		if ($themenu.length) {
			$elem
				.addClass('expanded')
				.attr({
					'aria-expanded': true,
					'aria-hidden': false,
/*					'tabindex': -1
*/				})
			;
		}

		$themenu
			.addClass('expanded')
			.attr({
				'aria-expanded': true,
				'aria-hidden': false
			});

		$themenu.find('li')
			.each(function() {

				$(this).children('a')
					.attr({
						'aria-hidden': false,
/*						'tabindex': 0
*/					})
				;

			});
	}

	function hideMenuFunction(event) {

		var $elem, $themenu, $menuitems;

		$elem = $('nav.ik_menu').children('button#menu_button');
		$themenu = $('button#menu_button').next('ul.looking-for');

		if ($themenu.length) {
			$elem.removeClass('expanded')
				.attr({
					'aria-expanded': false,
/*					'aria-hidden': true,
					'tabindex': 0
*/				})
			;
		}

		$themenu
			.removeClass('expanded')
			.attr({
				'aria-expanded': false,
				'aria-hidden': true,
			});

		$themenu.find('li')
			.each(function() {

				$(this).children('a')
					.attr({
						'aria-hidden': true,
/*						'tabindex': -1
*/					})
				;

			});
	}
/*
	function buttonKeyDownFunction(event) {

		var plugin, $elem, $current, $next, $parent, $submenu, $selected;

		plugin = event.data.plugin;
		$elem = $(plugin.element);
		$current = $(plugin.element).find(':focus');
		$submenu = $current.next('ul');

		switch (event.keyCode) {

			case ik_utils.keys.right:

				event.preventDefault();

				$current.attr({'tabindex': -1}).next('li').attr({'tabindex': 0}).focus();


				break;

			case ik_utils.keys.down:

				event.preventDefault();
				event.stopPropagation();

				if($current.parents('ul').length > 1) {
					$current.attr({'tabindex': -1}).next('li').attr({'tabindex': 0}).focus();
				}

				break;
		}

	}
*/

	/**
	 * Shows menu.
	 *
	 * @param {object} event - Mouse event.
	 */
/*	Plugin.prototype.showMenu = function(event) {

		var $elem, $themenu, $menuitems;

		$elem = $(event.currentTarget);
		$themenu = $('button#menu_button').next('ul.looking-for');

		if ($themenu.length) {
			$elem.addClass('expanded')
				.attr({
					'aria-expanded': true,
					'aria-hidden': false,
					'tabindex': -1
				})
			;
		}

		$themenu
			.addClass('expanded')
			.attr({
				'aria-expanded': true,
				'aria-hidden': false
			});

		$themenu.find('li')
			.each(function() {

				$(this).children('a')
					.attr({
						'tabindex': 0,
						'aria-hidden': false
					})
				;

			});

	};
*/
	/**
	 * Hides menu.
	 *
	 * @param {object} event - Mouse event.
	 */
/*	Plugin.prototype.hideMenu = function(event) {

		var $elem, $themenu, $menuitems;

		$elem = $(event.currentTarget);
		$themenu = $('button#menu_button').next('ul.looking-for');

		if ($themenu.length) {
			$elem.removeClass('expanded')
				.attr({
					'aria-expanded': false,
					'aria-hidden': true,
					'tabindex': 0
				})
			;
		}

		$themenu
			.removeClass('expanded')
			.attr({
				'aria-expanded': false,
				'aria-hidden': true,
			});

		$themenu.find('li')
			.each(function() {

				$(this).children('a')
					.attr({
						'tabindex': -1,
						'aria-hidden': true
					})
				;

			});

	};
*/
	/**
	 * Hides submenu.
	 *
	 * @param {object} event - Mouse event.
	 */
/*	Plugin.prototype.hideSubmenu = function(event) {

		var $elem, $submenu;

		$elem = $(event.currentTarget);
		$submenu = $elem.children('ul');

		if ($submenu.length) {
			$elem.removeClass('expanded')
				.attr({'aria-expanded': false})
			;

			$submenu.attr({'aria-hidden': true});
			$submenu.children('li').attr({'tabindex': -1});
		}
	};
*/
	/**
	 * Collapses all submenus. When element is specified collapses all submenus inside that element.
	 *
	 * @param {object} plugin - Reference to plugin.
	 * @param {object} [$elem] - jQuery object containing element (optional).
	 */
	Plugin.prototype.collapseAll = function(plugin, $elem) {

		$elem = $elem || plugin.element;

		$elem.find('ul.looking-for').attr({'aria-hidden': true});
		$elem.find('li.i-m-a-menuitem').attr({'aria-hidden': true});
		$elem.find('.expanded').removeClass('expanded').attr({'aria-expanded': false});
		$elem.find('li').attr({'tabindex': -1});
	};

	/**
	 * Activates menu selected menuitem.
	 *
	 * @param {Object} event - Keyboard or mouse event.
	 * @param {object} event.data - Event data.
	 * @param {object} event.data.plugin - Reference to plugin.
	 */
	Plugin.prototype.activateMenuItem = function(event) {

		var plugin, $elem;

		event.stopPropagation();

		plugin = event.data.plugin;
		$elem = $(event.currentTarget);

		plugin.collapseAll(plugin);

		if ($elem.has('a').length) {
			alert('Menu item ' + $elem.find('>a').text() + ' selected');
		}

	};


	$.fn[pluginName] = function ( options ) {

		return this.each(function () {

			if ( !$.data(this, pluginName )) {
				$.data( this, pluginName,
					new Plugin( this, options ));
			}

		});

	};

	/**
	 * Handles focus event on text field.
	 *
	 * @param {object} event - Keyboard event.
	 * @param {object} event.data - Event data.
	 * @param {object} event.data.plugin - Reference to plugin.
	 */
	Plugin.prototype.onFocus = function (event) {

		var plugin;

		plugin = event.data.plugin;
		plugin.notify.text(plugin.options.instructions);

	};

	/**
	 * Selects specified tab.
	 *
	 * @param {Object} event - Keyboard event.
	 * @param {object} event.data - Event data.
	 * @param {object} event.data.plugin - Reference to plugin.
	 * @param {object} event.data.index - Index of a tab to be selected.
	 */

	Plugin.prototype.onKeyDown = function (event) {

		var plugin, $elem, $current, $next, $parent, $submenu, $selected;

		plugin = event.data.plugin;
		$elem = $(plugin.element);
		$current = $(plugin.element).find(':focus');
		$submenu = $current.children('ul');
		$parentmenu = $($current.parent('ul'));
		$parentitem = $parentmenu.parent('li');

		switch (event.keyCode) {

			case ik_utils.keys.right:

				event.preventDefault();

				$current.attr({'tabindex': -1}).next('li').focus();

				break;

			case ik_utils.keys.left:

				event.preventDefault();

				$current.attr({'tabindex': -1}).prev('li').focus();

				break;

			case ik_utils.keys.up:

				event.preventDefault();
				event.stopPropagation();

				$current.attr({'tabindex': -1}).prev('li').focus();

				break;

			case ik_utils.keys.down:

				event.preventDefault();
				event.stopPropagation();

				$current.attr({'tabindex': -1}).next('li').focus();

				break;

			case ik_utils.keys.space:

				event.preventDefault();
				event.stopPropagation();

				if($submenu.length) {
					plugin.showSubmenu(event);
					$submenu.children('li:eq(0)').attr({'tabindex': 0}).focus();
				}
				break;

			case ik_utils.keys.esc:

				event.stopPropagation();

				hideMenuFunction(event);

				break;

			case ik_utils.keys.enter:

				plugin.activateMenuItem(event);

				break;

			case ik_utils.keys.tab:

				plugin.collapseAll(plugin);

				break;
		}
	}

})( jQuery, window, document );