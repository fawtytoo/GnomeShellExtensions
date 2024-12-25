const SwitcherPopup = imports.ui.switcherPopup;

var _disableHover = null;

function init()
{
    _disableHover = SwitcherPopup.SwitcherPopup.prototype._disableHover;
}

function enable()
{
    SwitcherPopup.SwitcherPopup.prototype._disableHover = () => {};
}

function disable()
{
    SwitcherPopup.SwitcherPopup.prototype._disableHover = _disableHover;
}
