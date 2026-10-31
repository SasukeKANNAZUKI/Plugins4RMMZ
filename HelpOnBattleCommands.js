//=============================================================================
// Plugin for RPG Maker MZ
// HelpOnBattleCommands.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc Display Help Window On Actor Commands
 * @author Sasuke KANNAZUKI
 *
 * @orderBefore VisuMZ_0_CoreEngine
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MZ.
 *
 *
 * [Summary]
 * Yanfly氏の VisuMZ_0_CoreEngine.js より上に置いて下さい。
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc 戦闘中のアクターコマンドにヘルプを追加
 * @author 神無月サスケ
 *
 * @orderBefore VisuMZ_0_CoreEngine
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMZに対応しています。
 *
 * ■概要
 * Yanfly氏の VisuMZ_0_CoreEngine.js より上に置いて下さい。
 * 
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  // ----------------------------------------------------------------------
  // Help Window in Actor Command
  // ----------------------------------------------------------------------

  const _Scene_Battle_createHelpWindow =
    Scene_Battle.prototype.createHelpWindow;
  Scene_Battle.prototype.createHelpWindow = function() {
    _Scene_Battle_createHelpWindow.call(this);
    this._actorCommandWindow.setHelpWindow(this._helpWindow);
  };

  //
  // show and hide help window
  //
  const _Window_ActorCommand_show = Window_ActorCommand.prototype.show;
  Window_ActorCommand.prototype.show = function () {
    _Window_ActorCommand_show.call(this);
    this.showHelpWindow();
  };

  const _Window_ActorCommand_hide = Window_ActorCommand.prototype.hide;
  Window_ActorCommand.prototype.hide = function () {
    this.hideHelpWindow();
    _Window_ActorCommand_hide.call(this);
  };

  const _Window_ActorCommand_activate = Window_ActorCommand.prototype.activate;
  Window_ActorCommand.prototype.activate = function () {
    _Window_ActorCommand_activate.call(this);
    if (this._helpWindow) {
      this.showHelpWindow();
    }
  };

  const _Window_ActorCommand_close = Window_ActorCommand.prototype.close;
  Window_ActorCommand.prototype.close = function () {
    _Window_ActorCommand_close.call(this);
    if (this._helpWindow) {
      this.hideHelpWindow();
    }
  };

/*
  //
  // set help window's text (★★★WIP)
  //
  Window_ActorCommand.prototype.textForHelp = function () {
    switch (this.currentSymbol()) {
    case 'item':
      return {description:"Use Item."};
    default:
      return {description:"Any Skill,"};
    }
  };

  Window_ActorCommand.prototype.updateHelp = function() {
    this.setHelpWindowItem(this.textForHelp());
  };
*/


})();
