//=============================================================================
// Plugin for RPG Maker MZ
// DisplayTurnCount.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc Display Turn Count Window at Battle
 * @author Sasuke KANNAZUKI
 *
 * @param turnName
 * @text Turn Name String
 * @desc Turn name for display
 * @type string
 * @default Current Turn:
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MZ.
 * This plugin shows current turn in battle.
 *
 * [Summary]
 * During battle, display window to current turn.
 * The window locates left and over the actor status window.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc 現在のターン数を表示するウィンドウ
 * @author 神無月サスケ
 *
 * @param turnName
 * @text ターン数文字列
 * @desc 「ターン数：」を現わす文字列
 * @type string
 * @default ターン数：
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMZに対応しています。
 *
 * このプラグインを導入すると、バトルの際、
 * 現在のターン数を表示するウィンドウを表示します。
 *
 * ■概要
 * 現在のターン数を表示するウィンドウは、アクターステータスの上の
 * 左端に表示されます。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'DisplayTurnCount';

  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const turnName = parameters['turnName'] || "Current Turn";

  const maxTurnString = "00000";

  //
  // Window for display Turn
  //
  function Window_TurnCount() {
    this.initialize(...arguments);
  }

  Window_TurnCount.prototype = Object.create(Window_Selectable.prototype);
  Window_TurnCount.prototype.constructor = Window_TurnCount;

  Window_TurnCount.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.turnCount = 0;
    this.refresh();
  };

  Window_TurnCount.prototype.colSpacing = function() {
    return 0;
  };

  Window_TurnCount.prototype.update = function() {
    const turnCount = $gameTroop._turnCount || 0;
    if (this.turnCount !== turnCount) {
      this.turnCount = turnCount;
      this.refresh();
    }
  };

  Window_TurnCount.prototype.open = function() {
    this.refresh();
    Window_Selectable.prototype.open.call(this);
  };

  Window_TurnCount.prototype.refresh = function() {
    this.contents.clear();
    // display turn name string
    this.changeTextColor(this.systemColor());
    const turnStrWidth = this.textWidth(maxTurnString);
    const maxWidth = Graphics.boxWidth - turnStrWidth;
    this.drawText(turnName, 0, 0, maxWidth, "left");
    // display current turn
    this.resetTextColor();
    const turnTxt = String(this.turnCount);
    const turnNameWidth = this.textWidth(turnName);
    this.drawText(turnTxt, turnNameWidth, 0, turnStrWidth, "right");
  };

  //
  // add turn window to the screen
  //
  const _Scene_Battle_createAllWindows =
    Scene_Battle.prototype.createAllWindows;
  Scene_Battle.prototype.createAllWindows = function() {
    _Scene_Battle_createAllWindows.call(this);
    this.createTurnWindow();
  };

  Scene_Battle.prototype.createTurnWindow = function() {
    const rect = this.turnWindowRect();
    const turnWindow = new Window_TurnCount(rect);
    this.addWindow(turnWindow);
    this._turnWindow = turnWindow;
  };

  Scene_Battle.prototype.turnWindowRect = function() {
    const ww = this._statusWindow.textWidth(turnName + maxTurnString) + 32;
    const wh = this.calcWindowHeight(1, true);
    const wx = 0;
    const wy = Graphics.boxHeight - this.windowAreaHeight() - wh;
    return new Rectangle(wx, wy, ww, wh);
  };

})();
