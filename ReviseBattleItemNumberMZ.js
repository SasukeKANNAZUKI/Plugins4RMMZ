//=============================================================================
// ReviseBattleItemNumberMZ.js
//=============================================================================
// [Update History of MV Version]  ReviceBattleItemNumber.js
// 2017.Jul.06 1.0.0  first release
// 2017.Jul.07 1.0.3  fix several bugs
// 2017.Nov.26 1.0.4  fix bug when the party have no items, it'll invoke error.
// 2019.Jan.08 1.0.4a fix bug when back to the party command(temp. ver.)
//
// [Update History]
// 2024.Sep.07 1.0.0  first release for RMMZ

/*:
 * @target MZ
 * @plugindesc In Battle, reduce item number that previous actor selected
 * @author Sasuke KANNAZUKI
 *
 * @help
 * This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MZ.
 *
 * [Summary]
 *
 * This plugin only works when the battle system is Turn-based.
 *
 * At current turn-based system, display item number is fixed on battle,
 * but sometimes this specification invokes problem for example...
 * - 3 actors select the same item that the party have only 1, 2 actors
 *   can't do anyhing at the turn (the item assumes consume item)
 * - Even if the party has an item that never consume only 1, all actor can
 *   select it and acutually effective. It's not natural.
 *
 * This plugin solves the problem by reducing that previous actors select
 * item number. Do not worry, the item reduced is only on screen,
 * actually, the items not reduced until the actor uses in the battle.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc 戦闘時、先にアクターが使用したアイテム数を減らして表示します。
 * @author 神無月サスケ
 *
 * @help
 * このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMZに対応しています。
 *
 * ■概要
 *
 * このプラグインは、戦闘システムがターン制の時にのみ有効です。
 *
 * 従来のシステムでは、アイテムの数は固定表示でした。
 * このため、１個しかないアイテムを２人以上が選択し、使えない人が出てきたり、
 * 使用回数無制限のアイテムをひとつ持っていれば、全員が使うことが出来ました。
 *
 * このプラグインでは、先に入力したアクターが選択したアイテムの分、
 * 数を減らして表示するため、上記のような問題が回避されます。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  //
  // initialization and termination
  //
  const _BattleManager_initMembers = BattleManager.initMembers;
  BattleManager.initMembers = function() {
    _BattleManager_initMembers.call(this);
    this.reservedItem = {};
  };

  const _BattleManager_endBattle = BattleManager.endBattle;
  BattleManager.endBattle = function(result) {
    this.reservedItem = null;
    _BattleManager_endBattle.call(this, result);
  };

  const _BattleManager_startTurn = BattleManager.startTurn;
  BattleManager.startTurn = function() {
    _BattleManager_startTurn.call(this);
    this.reservedItem = {};
  };

  //
  // display item number considering reserved item
  //
  Scene_Battle.prototype.reduceDisplayItemNumber = function () {
    if (!BattleManager.isTpb()) {
      const action = BattleManager.inputtingAction();
      if (action && action.isItem()) {
        const item = this._itemWindow.item();
        if (item && DataManager.isItem(item)) {
          const reduceNum = BattleManager.reservedItem[item.id];
          BattleManager.reservedItem[item.id] = reduceNum ? reduceNum + 1 : 1;
        }
      }
    }
  };

  const _Scene_Battle_onSelectAction = Scene_Battle.prototype.onSelectAction;
  Scene_Battle.prototype.onSelectAction = function() {
    const action = BattleManager.inputtingAction();
    if (action && !action.needsSelection()) { // no need to select battler
      this.reduceDisplayItemNumber();
    }
    _Scene_Battle_onSelectAction.call(this);
  };

  const _Scene_Battle_onActorOk = Scene_Battle.prototype.onActorOk;
  Scene_Battle.prototype.onActorOk = function() {
    this.reduceDisplayItemNumber();
    _Scene_Battle_onActorOk.call(this);
  };

  const _Scene_Battle_onEnemyOk = Scene_Battle.prototype.onEnemyOk;
  Scene_Battle.prototype.onEnemyOk = function() {
    this.reduceDisplayItemNumber();
    _Scene_Battle_onEnemyOk.call(this);
  };

  //
  // the case command cancelled
  //
  const cancelItemRequest = currentActor => {
    if (currentActor) {
      const action = currentActor._actions[currentActor._actionInputIndex];
      if (action && action.isItem()) {
        --BattleManager.reservedItem[action.item().id];
      }
    }
  };

  const _Scene_Battle_selectPreviousCommand =
   Scene_Battle.prototype.selectPreviousCommand;
  Scene_Battle.prototype.selectPreviousCommand = function() {
    if (!BattleManager.isTpb()) {
      _Scene_Battle_selectPreviousCommand.call(this);
      cancelItemRequest(BattleManager.actor());
      return;
    }
    _Scene_Battle_selectPreviousCommand.call(this);
  };

  //
  // routine for display window
  //
  const _Window_ItemList_drawItemNumber =
   Window_ItemList.prototype.drawItemNumber;
  Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
    if ($gameParty.inBattle() && !BattleManager.isTpb()) {
      const itemNum = BattleManager.reservedItem[item.id] || 0;
      if (itemNum > 0) {
        $gameParty.loseItem(item, itemNum);
        _Window_ItemList_drawItemNumber.call(this, item, x, y, width);
        $gameParty.gainItem(item, itemNum);
        return;
      }
    }
    _Window_ItemList_drawItemNumber.call(this, item, x, y, width);
  };

  const _Window_ItemList_isEnabled = Window_ItemList.prototype.isEnabled;
  Window_ItemList.prototype.isEnabled = function(item) {
    if ($gameParty.inBattle() && !BattleManager.isTpb()) {
      if (item) {
        const itemNum = BattleManager.reservedItem[item.id] || 0;
        if ($gameParty.numItems(item) - itemNum === 0) {
          return false;
        }
      }
    }
    return _Window_ItemList_isEnabled.call(this, item);
  };
})();
