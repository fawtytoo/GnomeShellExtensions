const Overview = imports.ui.overview;

const Config = imports.misc.config;
const Version = parseInt(Config.PACKAGE_VERSION.split('.')[0]);

let oldOverview;

function overviewToggle()
{
    if (this.isDummy)
        return;

    if (this.visible)
    {
        this.hide();
        return;
    }

    if (Version == 3)
        this.viewSelector.showApps();
    else
        this.showApps();
}

function init()
{
    oldOverview = Overview.Overview.prototype['toggle'];
}

function enable()
{
    Overview.Overview.prototype['toggle'] = overviewToggle;
}

function disable()
{
    Overview.Overview.prototype['toggle'] = oldOverview;
}
