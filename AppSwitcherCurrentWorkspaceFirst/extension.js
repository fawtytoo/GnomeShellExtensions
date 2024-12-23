const AltTab = imports.ui.altTab;
const Meta = imports.gi.Meta;
const Shell = imports.gi.Shell;
const Gio = imports.gi.Gio;

var _originalFunction;

var _manager;

var windowTracker, settings;

function appSwitcher_init(apps, altTabPopup)
{
    let workspace = _manager.get_active_workspace();

    // should this be done here?
    if (settings.get_boolean('current-workspace-only') == true)
        settings.set_boolean('current-workspace-only', false); // ... to be sure

    // retrieve window list for all workspaces
    let allWindows = global.display.get_tab_list(Meta.TabList.NORMAL, null);

    // we will create our own apps list to pass to the original _init
    // apps are split into 2 if they have windows on other workspaces
    let appsCurrent = allWindows.filter(window => window.get_workspace() == workspace).map(window => windowTracker.get_window_app(window)).filter((app, index, array) => array.indexOf(app) >= index);
    let appsOther = allWindows.filter(window => window.get_workspace() != workspace).map(window => windowTracker.get_window_app(window)).filter((app, index, array) => array.indexOf(app) >= index);

    // pass appsCurrent and appsOther to the original _init ...
    _originalFunction.apply(this, [appsCurrent.concat(appsOther), altTabPopup]);

    let aIcons = this.icons;
    let appCount = appsCurrent.length; // number of apps on the current workspace

    // tidy up the cachedWindows on each AppIcon
    for (let i = 0; i < aIcons.length; i++)
    {
        if (aIcons[i].cachedWindows.length == 0) // support for Super+Tab Launcher extension
            continue;

        if (i < appCount)
            aIcons[i].label.add_style_class_name('label-highlight');

        aIcons[i].cachedWindows = aIcons[i].cachedWindows.filter(window => i < appCount ? window.get_workspace() == workspace : window.get_workspace() != workspace);

        if (aIcons[i].cachedWindows.length < 2)
            this._arrows[i].hide();
    }
}

function init()
{
    // thanks to jwarkentin for suggesting global.workspace_manager
    _manager = global.screen;
    if (_manager == undefined)
        _manager = global.workspace_manager;

    windowTracker = Shell.WindowTracker.get_default();
}

function enable()
{
    settings = new Gio.Settings({ schema_id: 'org.gnome.shell.app-switcher' });
    if (settings.get_boolean('current-workspace-only') == true)
        settings.reset('current-workspace-only'); // if the default value is FALSE or ...

    _originalFunction = AltTab.AppSwitcher.prototype._init;
    AltTab.AppSwitcher.prototype._init = appSwitcher_init;
}

function disable()
{
    AltTab.AppSwitcher.prototype._init = _originalFunction;
    settings = null;
}
