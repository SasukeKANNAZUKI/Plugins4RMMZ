//=============================================================================
// Plugin for RPG Maker MZ
// EscapeDungeonMZ.js
//=============================================================================
// [Update History]
// 2021.Mar.05 Ver.1.0.0 First Release

/*:
 * @target MZ
 * @plugindesc Enables to make skill/item that escape from dungen
 * @author Sasuke KANNAZUKI
 *
 * @param varIdForMapId
 * @text Var.Id for Map Id
 * @desc Variable of Map ID for escape destination.
 * @type variable
 * @default 1
 *
 * @param varIdForXcoord
 * @text Var.Id for X
 * @desc Variable of X coord for escape destination.
 * @type variable
 * @default 2
 *
 * @param varIdForYcoord
 * @text Var.Id for Y
 * @desc Variable of Y coord for escape destination.
 * @type variable
 * @default 3
 *
 * @command set
 * @text Set Escape Position
 * @desc Set when player go into dungeon that can escape.
 *
 * @arg MapId
 * @text Map ID
 * @desc Destination Map ID. Set 0 to reset escape.
 * @type number
 * @min 0
 * @default 0
 *
 * @arg X
 * @desc X coord for escape destination.
 * @type number
 * @min 0
 * @default 0
 *
 * @arg Y
 * @desc Y coord for escape destination.
 * @type number
 * @min 0
 * @default 0
 *
 * @command reset
 * @text Reset Escape Position
 * @desc Execute when player go out from dungeon. Be sure to do it when player go out by event and so on.
 *
 * @command execute
 * @text Execute Escape
 * @desc Call this from common event when it needs escape. After performing this, escape position is reset automatically.
 *
 * @help
 * This plugin runs under RPG Maker MZ.
 * This plugin enables to make skill/item that can escape from dungeon.
 *
 * [Plugin Commands]
 * This plugin provides following plugin commands.
 *
 * ・Set Escape Position
 * ・Reset Escape Position
 *  You don't need to execute Set/Reset Escape Position if you set
 *  parameter variables directly. Note that you can reset escape position
 *  by setting map ID be 0.
 *
 * ・Execute Escape
 *  Run this from common event when it needs. Since this command doesn't
 *  display any effects, you had better to set animations or fades and so on
 *  before and/or after the command.
 *
 * [How to make escape magic or item]
 * At first you make common event to execute escape, then make skills/items
 * whose effect is 'common event' to call the common event.
 *
 * Write <EscapeDungeon> to the skill/item to disable to use it
 * when escape destination is not set.
 *
 * [NOTE]
 * Player cannot escape when in the battle.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc ダンジョン脱出スキル
 * @author 神無月サスケ
 *
 * @param varIdForMapId
 * @text マップID格納変数ID
 * @desc エスケープ先のマップIDを記憶する変数IDです。
 * @type variable
 * @default 1
 *
 * @param varIdForXcoord
 * @text X座標格納変数ID
 * @desc エスケープ先のX座標を記憶する変数IDです。
 * @type variable
 * @default 2
 *
 * @param varIdForYcoord
 * @text Y座標格納変数ID
 * @desc エスケープ先のY座標を記憶する変数IDです。
 * @type variable
 * @default 3
 *
 * @command set
 * @text エスケープ位置の設定
 * @desc ダンジョンに入る時に実行してください。
 *
 * @arg MapId
 * @text マップID
 * @desc エスケープ先のマップIDです。0を指定すると解除されます。
 * @type number
 * @min 0
 * @default 0
 *
 * @arg X
 * @text X座標
 * @desc エスケープ先のX座標です。
 * @type number
 * @min 0
 * @default 0
 *
 * @arg Y
 * @text Y座標
 * @desc エスケープ先のY座標です。
 * @type number
 * @min 0
 * @default 0
 *
 * @command reset
 * @text エスケープ位置の解除
 * @desc ダンジョンから出る時に実行してください。イベントなどでダンジョン外に移動する際も忘れずに。
 *
 * @command execute
 * @text エスケープの実行
 * @desc コモンイベントから呼び出してください。実行後、エスケープ位置は自動的に解除されます。
 *
 * @help
 * このプラグインは、RPGツクールMZに対応しています。
 * このプラグインは、ダンジョンから脱出する（以下、エスケープ）
 * スキルやアイテムの作成を可能にします。
 *
 * ■プラグインコマンド
 * ・エスケープ位置の設定
 * ・エスケープ位置の解除
 *  エスケープ位置の変更は、プラグインコマンドを呼び出さず、
 *  マップID, X座標, Y座標の変数を直接操作して変更することも可能です。
 *  マップIDの変数の値が0の時は、解除状態(デフォルト)となります。
 *
 * ・エスケープの実行
 *  エスケープの実行は前後にアニメーションを行わないため、
 *  コモンイベントで実行する前後に、アニメーションやフェードなどの演出を
 *  加えてください。
 *
 * ■スキル/アイテム作成方法
 * 上記のプラグインコマンド「エスケープの実行」を行うコモンイベントを作成し、
 * スキルやアイテムの「使用効果」にそのコモンイベントを設定してください。
 *
 * エスケープ位置が未設定/解除の場合に使用不可にするには、
 * そのアイテムやスキルのメモに <EscapeDungeon> と記述してください。
 *
 * ■注意
 * エスケープは移動時のみ有効です。戦闘中は使用不可です。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'EscapeDungeonMZ';
  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const escapeMapId = Number(parameters['varIdForMapId'] || 1);
  const escapeX = Number(parameters['varIdForXcoord'] || 2);
  const escapeY = Number(parameters['varIdForYcoord'] || 3);

  //
  // process plugin commands
  //
  const setEscapePosition = (mapId, x, y) => {
    $gameVariables.setValue(escapeMapId, mapId);
    $gameVariables.setValue(escapeX, x);
    $gameVariables.setValue(escapeY, y);
  };

  PluginManager.registerCommand(pluginName, 'set', args => {
    setEscapePosition(+args.MapId, +args.X, +args.Y);
  });

  PluginManager.registerCommand(pluginName, 'reset', args => {
    setEscapePosition(0, 0, 0);
  });

  PluginManager.registerCommand(pluginName, 'execute', args => {
    const mapId = $gameVariables.value(escapeMapId);
    if (mapId) {
      const x = $gameVariables.value(escapeX);
      const y = $gameVariables.value(escapeY);
      $gamePlayer.reserveTransfer(mapId, x, y, 2, 2);
      $gameMap._interpreter.setWaitMode("transfer");
      setEscapePosition(0, 0, 0);
    }
  });

  //
  // judge and determine whether the skill/item is usable or not.
  //
  const _Game_Actor_canUse = Game_Actor.prototype.canUse;
  Game_Actor.prototype.canUse = function(item) {
    const result = _Game_Actor_canUse.call(this, item);
    if (result) {
      if (item && item.meta.EscapeDungeon) {
        return !$gameParty.inBattle() && !!$gameVariables.value(escapeMapId);
      }
      return true;
    }
    return result;
  };

})();
