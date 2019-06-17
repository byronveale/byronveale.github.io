$(document).ready(function() {

    var menuNav = $('nav.menu');

    var menuButton = menuNav.children('button#menu_button');

    var menuInstructions = menuNav.children('#menu_instructions');

    var menuBar = menuButton.next('ul');

    var menuListItems = menuBar.children('li');

    var menuLinks = menuListItems.children('a');

    /**
     * Initialize menu items.
     */
    menuButton
        .addClass('expandable')
        .attr('aria-expanded', 'false')
    ;

    menuBar
        .addClass('menu-bar expandable')
        .attr('aria-expanded', 'false')
        .attr('aria-haspopup', 'true')
        .attr('aria-hidden', 'true')
        .attr('aria-labeledby', 'menu_button')
        .attr('role', 'menubar')
    ;

    menuListItems
        .addClass('menu-list-item')
        .first()
        .addClass('first')
    ;
    menuListItems
        .last()
        .addClass('last')
    ;

    menuLinks
        .addClass('menu-item')
        .attr('role', 'menuitem')
        .attr('tabindex', '-1')
    ;

    menuButton.on('focus mouseenter', function(event) {
        showMenu(menuButton, menuBar, menuListItems, menuLinks);
    });

    function showMenu(button, bar, items, links){
        button
            .addClass('expanded')
            .attr('aria-expanded', 'true')
        ;

        menuInstructions
            .addClass('visible')
        ;

        bar
            .addClass('expanded')
            .attr('aria-expanded', 'true')
            .attr('aria-hidden', 'false')
        ;
    }

    menuNav.on('mouseleave blur', function(event) {
        hideMenu(menuButton, menuBar, menuListItems, menuLinks);
    });

    function hideMenu(button, bar, items, links){
        button
            .removeClass('expanded')
            .attr('aria-expanded', 'false')
        ;

        menuInstructions
            .removeClass('visible')
        ;

        bar
            .removeClass('expanded')
            .attr('aria-expanded', 'false')
            .attr('aria-hidden', 'true')
        ;
    }

    menuNav.keydown(function(event){
        switch (event.which) {
            case 9: // Tab key
                hideMenu(menuButton, menuBar, menuListItems, menuLinks);
                $(this).blur();
                break;

            case 27: // Escape key
                hideMenu(menuButton, menuBar, menuListItems, menuLinks);
                break;
        }
    });

    menuButton.keydown(function(event){
        switch (event.which) {
            case 13: // Return key
                if ($(this).hasClass('expanded')) {
                    hideMenu(menuButton, menuBar, menuListItems, menuLinks);
                }
                else {
                    showMenu(menuButton, menuBar, menuListItems, menuLinks);
                }
                break;

            case 40: // Down arrow
                event.preventDefault();
                event.stopPropagation();
                $(this)
                    .next('ul.looking-for')
                    .children('li')
                    .eq(0)
                    .children('a.menu-item')
                    .focus()
                ;
                break;

            case 39: // Right arrow
                event.preventDefault();
                event.stopPropagation();
                $(this)
                    .next('ul.looking-for')
                    .children('li')
                    .eq(0)
                    .children('a.menu-item')
                    .focus()
                ;
                break;
        }
    });

    menuLinks.keydown(function(event){
        switch (event.which) {
            case 40: // Down arrow
                event.preventDefault();
                event.stopPropagation();
                // If last list item, set focus on first item.
                if ($(this).parent('li').hasClass('last')) {
                    $(this).parents('ul.menu-bar').children('li.first').children('a').focus();
                } else {
                    $(this)
                        .parent('li.menu-list-item')
                        .next('li.menu-list-item')
                        .children('a.menu-item')
                        .focus()
                    ;
                }
                break;

            case 39: // Right arrow
                event.preventDefault();
                event.stopPropagation();
                // If last list item, set focus on first item.
                if ($(this).parent('li').hasClass('last')) {
                    $(this).parents('ul.menu-bar').children('li.first').children('a').focus();
                } else {
                    $(this)
                        .parent('li.menu-list-item')
                        .next('li.menu-list-item')
                        .children('a.menu-item')
                        .focus()
                    ;
                }
                break;

            case 38: // Up arrow
                event.preventDefault();
                event.stopPropagation();
                // If first list item, set focus on last item.
                if ($(this).parent('li').hasClass('first')) {
                    $(this).parents('ul.menu-bar').children('li.last').children('a').focus();
                } else {
                    $(this)
                        .parent('li')
                        .prev('li')
                        .children('a')
                        .focus()
                    ;
                }
                break;

            case 37: // Left arrow
                event.preventDefault();
                event.stopPropagation();
                // If first list item, set focus on last item.
                if ($(this).parent('li').hasClass('first')) {
                    $(this).parents('ul.menu-bar').children('li.last').children('a').focus();
                } else {
                    $(this)
                        .parent('li')
                        .prev('li')
                        .children('a')
                        .focus()
                    ;
                }
                break;

        }
    });


});
