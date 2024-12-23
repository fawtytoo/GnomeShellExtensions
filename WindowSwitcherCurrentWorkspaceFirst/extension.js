const AltTab = imports.ui.altTab;
const Config = imports.misc.config;

let AltTab_WindowList;

var _originalFunction = [];

var _manager;

let currentLength;

function windowList_init(windows, mode)
{
    let workspace = _manager.get_active_workspace();
    // the first window in the list should be the currently focused window
    // therefore, we can use that for sorting
    let monitor = windows[0].get_monitor();

    let current = windows.filter(window => window.get_workspace() == workspace).filter(window => window.get_monitor() == monitor).concat(windows.filter(window => window.get_workspace() == workspace).filter(window => window.get_monitor() != monitor));

    currentLength = current.length;

    // this line keeps the z-order of windows from other workspaces
    current = current.concat(windows.filter(window => window.get_workspace() != workspace));

    // ... whereas these lines reorder the other windows according to workspace
    // thus losing the z-order
//    let active = _manager.get_active_workspace_index();
//    for (let i = 0; i < _manager.n_workspaces; i++)
//        if (i != active)
//            current = current.concat(windows.filter(window => window.get_workspace() == _manager.get_workspace_by_index(i)));

    // pass the new list to the original function
    _originalFunction['windowList_init'].apply(this, [current, mode]);
}

function windowList_highlight(index, justOutline)
{
    _originalFunction['windowList_highlight'].apply(this, [index, justOutline]);

    // the old style needs to be removed before applying another one
    this._label.remove_style_class_name(index < currentLength ? 'label-app-other' : 'label-app-current');
    this._label.add_style_class_name(index < currentLength ? 'label-app-current' : 'label-app-other');
}

function windowSwitcherPopup_getWindowList()
{
    // we need windows from all workspaces
    return AltTab.getWindows(null);
}

function init()
{
    // thanks to jwarkentin for suggesting global.workspace_manager
    _manager = global.screen;
    if (_manager == undefined)
        _manager = global.workspace_manager;

    if (AltTab.WindowList)
        AltTab_WindowList = AltTab.WindowList;
    else
        AltTab_WindowList = AltTab.WindowSwitcher;
}

function enable()
{
    _originalFunction['windowList_init'] = AltTab_WindowList.prototype._init;
    AltTab_WindowList.prototype._init = windowList_init;
    _originalFunction['windowList_highlight'] = AltTab_WindowList.prototype.highlight;
    AltTab_WindowList.prototype.highlight = windowList_highlight;
    _originalFunction['windowSwitcherPopup_getWindowList'] = AltTab.WindowSwitcherPopup.prototype._getWindowList;
    AltTab.WindowSwitcherPopup.prototype._getWindowList = windowSwitcherPopup_getWindowList;
}

function disable()
{
    AltTab_WindowList.prototype._init = _originalFunction['windowList_init'];
    AltTab_WindowList.prototype.highlight = _originalFunction['windowList_highlight'];
    AltTab.WindowSwitcherPopup.prototype._getWindowlist = _originalFunction['windowSwitcherPopup_getWindowList'];
}
