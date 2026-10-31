//=============================================================================
// Plugin for RPG Maker MZ
// TribeScope.js
//=============================================================================
// [Update History]
// 2021.Feb.18 Ver1.0.0 First Release
// 2021.Feb.19 Ver1.0.1 Fix Bug : When select tribes, only one of it was blink.
// 2021.Feb.24 Ver1.0.2 Fix Bug : touch selection makes wrong target
// 2024.Feb.11 Ver1.1.0 Resolve the confliction with MOG_BattleCursor.js
// 2024.Aug.29 Ver1.2.0 Scope definition of Party is selectable (each or all).

/*:
 * @target MZ
 * @plugindesc [Ver1.2.0]Introduce item/skill new scope: a tribe(sub group).
 * @author Sasuke KANNAZUKI
 *
 * @param isPartyOneTribe
 * @text Is Party One Tribe?
 * @desc Is All Member One Tribe or Each Member is One Tribe?
 * @type select
 * @option All Party Members
 * @value all
 * @option Each Member
 * @value one
 * @default one
 *
 * @orderAfter MOG_BattleCursor
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MZ.
 * This plugin enables the new scope 'tribe' the sub group.
 *
 * [Summary]
 * To the item/skill's scope be 'a tribe', write following to its note.
 * <ScopeTribe>
 * In this case, the scope set in database is ignored.
 *
 * [Definition of Tribe]
 * Tribe is the sub group of troop that is the same enemy id.
 * If the same enemy id in the troop's index, it is an tribe.
 *
 * For example, consider following 2 troops.
 * 1) [goblin, goblin, bat]
 * 2) [goblin, bat, goblin]
 * In the case 1, the troop is separated 2 tribes. [goblin * 2, bat]
 * But the case 2, since goblin is separeted, the troop has 3 tribes
 * that each tribe has one enemy.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc [Ver1.2.0]アイテムやスキルの効果範囲に「敵グループ（種族）」を導入します。
 * @author 神無月サスケ
 *
 * @param isPartyOneTribe
 * @text パーティは1種族？
 * @desc 味方パーティーは、全員で1グループ？ それとも各キャラが1グループ？
 * @type select
 * @option 全員
 * @value all
 * @option キャラ毎
 * @value one
 * @default one
 *
 * @orderAfter MOG_BattleCursor
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMZに対応しています。
 * このプラグインは、効果範囲に、敵１種族（１グループ）を追加します。
 *
 * ■概要
 * アイテムやスキルの効果範囲を敵１種族にする場合、メモに以下のように書きます：
 * <ScopeTribe>
 * この時、データベースでの範囲指定は無視され、1種族に効果のあるものになります。 *
 * ■種族の定義
 * データベース「敵グループ」での順序が連続した同じ種族の敵キャラの集まりを
 * １種族として扱います。
 * 同じ敵キャラであっても順番が連続していない場合は、
 * 異なる種族として扱います。
 * 例えば、[ゴブリン、こうもり、こうもり]　の場合、
 * (ゴブリン１、こうもり２)の２種族になりますが、
 * [こうもり、ゴブリン、こうもり]の場合、１体ずつの３種族になります。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'TribeScope';

  //
  // set magic number for tribe scope.
  //

  // NOTE: 330 is the magic number with no mean.
  // If this number conflicts another plugin,
  // change the number.
  const ScopeTribe = 330;

  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const isPartyOneTribe = parameters['isPartyOneTribe'] === "all";

  //
  // process note at first
  //
  const _Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function() {
    _Scene_Boot_start.call(this);
    processItemScope();
  };

  const processItemScope = () => {
    for (const item of [...$dataSkills, ...$dataItems]) {
      if (item && item.name && item.meta.ScopeTribe) {
        item.scope = ScopeTribe;
      }
    }
  };

  //
  // check if its scope is for tribe
  //
  Game_Action.prototype.isForTribe = function() {
    return this.item() && this.item().scope === ScopeTribe;
  };

  const _Game_Action_isForOpponent = Game_Action.prototype.isForOpponent;
  Game_Action.prototype.isForOpponent = function() {
    if (this.isForTribe()) {
      return true;
    }
    return _Game_Action_isForOpponent.call(this);
  };

  const _Game_Action_needsSelection = Game_Action.prototype.needsSelection;
  Game_Action.prototype.needsSelection = function() {
    if (this.isForTribe()) {
      return true;
    }
    return _Game_Action_needsSelection.call(this);
  };

  //
  // process tribe scope to the unit
  //
  Game_Unit.prototype.tribeIn = function(member) {
    if (!this.members().includes(member)) {
      return [];
    } else {
      return this.members();
    }
  };

  Game_Unit.prototype.aliveMembersInTribe = function(member) {
    const members = this.tribeIn(member);
    return members.filter(member => member.isAlive());
  };

  Game_Unit.prototype.tribes = function() {
    const members = this.members();
    if (isPartyOneTribe) {
      return members.length > 0 ? [members] : [];
    } else {
      let tribes = [];
      for (const member of members) {
        tribes.push([member]);
      }
      return tribes;
    }
  };

  Game_Unit.prototype.validTribes = function() {
    let livingTribes = [];
    const allTribes = this.tribes();
    for (const tribe of allTribes) {
      const living = tribe.filter(m => m.isAlive());
      if (living.length > 0) {
        livingTribes.push(living);
      }
    }
    return livingTribes;
  };

  // Note: this function returns array of candidate members.
  Game_Unit.prototype.smoothTargetTribe = function(enemyIndex) {
    const member = this.members()[Math.max(0, enemyIndex)];
    const livingMembers = this.aliveMembersInTribe(member);
    if (livingMembers.length > 0) {
      return livingMembers;
    }
    return this.randomTargetTribe();
  };

  Game_Unit.prototype.randomTargetTribe = function() {
    const tribes = this.validTribes();
    return tribes[Math.randomInt(tribes.length)];
  }

  // *** overwrite!! ***
  Game_Unit.prototype.smoothTarget = function(index) {
    const member = this.members()[Math.max(0, index)];
    if (member && member.isAlive()) {
      return member;
    }
    // if there's the same tribe battler, select from them.
    if (member) {
      const members = this.aliveMembersInTribe(member);
      if (members.length > 0) {
        return members[0];
      }
    }
    return this.aliveMembers()[0];
  };

  //
  // process the tribe scope for troop
  //
  Game_Troop.prototype.tribeIn = function(member) {
    const allTribes = this.tribes();
    return allTribes.find(tribe => tribe.includes(member)) || [];
  };

  Game_Troop.prototype.tribes = function() {
    let arranged = [];
    let currentTribe = null;
    let currentEnemyId = null;
    for (const enemy of this.members()) {
      if (enemy.enemyId() === currentEnemyId) {
        currentTribe.push(enemy);
      } else { // if it's top enemy in the tribe
        if (currentTribe) {
          // store previous tribe
          arranged.push(currentTribe);
        }
        // make new tribe
        currentEnemyId = enemy.enemyId();
        currentTribe = [enemy];
      }
    }
    // store last tribe
    if (currentTribe) {
      arranged.push(currentTribe);
    }
    return arranged;
  };

  //
  // create and set tribe window
  //

  // in this function, create also tribe window!
  const _Scene_Battle_createEnemyWindow =
    Scene_Battle.prototype.createEnemyWindow;
  Scene_Battle.prototype.createEnemyWindow = function() {
    _Scene_Battle_createEnemyWindow.call(this);
    this.createTribeWindow();
  };

  Scene_Battle.prototype.createTribeWindow = function() {
    // rect is the same as Window_BattleEnemy!
    const rect = this.enemyWindowRect();
    this._tribeWindow = new Window_BattleTribe(rect);
    this._tribeWindow.setHandler("ok", this.onTribeOk.bind(this));
    this._tribeWindow.setHandler("cancel", this.onTribeCancel.bind(this));
    this.addWindow(this._tribeWindow);
  };

  Scene_Battle.prototype.onTribeOk = function() {
    const action = BattleManager.inputtingAction();
    action.setTarget(this._tribeWindow.enemyIndex());
    this.hideSubInputWindows();
    this.selectNextCommand();
  };

  Scene_Battle.prototype.onTribeCancel = function() {
    this._tribeWindow.hide();
    this.onEnemyCancel();
  };

  const _Scene_Battle_startEnemySelection =
    Scene_Battle.prototype.startEnemySelection;
  Scene_Battle.prototype.startEnemySelection = function() {
    const action = BattleManager.inputtingAction();
    if (action.isForTribe()) {
      this._tribeWindow.refresh();
      this._tribeWindow.show();
      this._tribeWindow.select(0);
      this._tribeWindow.activate();
      this._statusWindow.hide();
      return;
    }
    _Scene_Battle_startEnemySelection.call(this);
  };

  const _Scene_Battle_isAnyInputWindowActive =
    Scene_Battle.prototype.isAnyInputWindowActive;
  Scene_Battle.prototype.isAnyInputWindowActive = function() {
    if (_Scene_Battle_isAnyInputWindowActive.call(this)) {
      return true;
    }
    return this._tribeWindow.active;
  };

  const _Scene_Battle_hideSubInputWindows =
    Scene_Battle.prototype.hideSubInputWindows;
  Scene_Battle.prototype.hideSubInputWindows = function() {
    _Scene_Battle_hideSubInputWindows.call(this);
    this._tribeWindow.deactivate();
    this._tribeWindow.hide();
  };

  //
  // decide target to tribe
  //
  const _Game_Action_targetsForAlive =
    Game_Action.prototype.targetsForAlive;
  Game_Action.prototype.targetsForAlive = function(unit) {
    if (this.isForTribe()) {
      return this._targetIndex < 0 ? unit.randomTargetTribe() :
        unit.smoothTargetTribe(this._targetIndex);
    }
    return _Game_Action_targetsForAlive.call(this, unit);
  };

  //---------------------------------------------------------------------------
  // Window_BattleTribe
  //
  function Window_BattleTribe() {
    this.initialize(...arguments);
  }

  Window_BattleTribe.prototype = Object.create(Window_BattleEnemy.prototype);
  Window_BattleTribe.prototype.constructor = Window_BattleTribe;

  Window_BattleTribe.prototype.initialize = function(rect) {
    this._tribes = $gameTroop.validTribes();
    Window_BattleEnemy.prototype.initialize.call(this, rect);
  };

  Window_BattleTribe.prototype.maxItems = function() {
    return this._tribes.length;
  };

  Window_BattleTribe.prototype.enemy = function() {
    const tribe = this._tribes[this.index()];
    return tribe ? tribe[0] : null;
  };

  Window_BattleTribe.prototype.drawItem = function(index) {
    this.resetTextColor();
    const name = this._tribes[index][0].originalName();
    const number = this._tribes[index].length;
    const rect = this.itemLineRect(index);
    const desc = "%1 × %2".format(name, number);
    this.drawText(desc, rect.x, rect.y, rect.width);
  };

  Window_BattleTribe.prototype.refresh = function() {
    this._tribes = $gameTroop.validTribes();
    Window_BattleEnemy.prototype.refresh.call(this);
  };

  Window_BattleTribe.prototype.processTouch = function() {
    Window_Selectable.prototype.processTouch.call(this);
    if (this.isOpenAndActive()) {
      const target = $gameTemp.touchTarget();
      if (target && this._enemies.includes(target)) {
        const targetTribe = $gameTroop.tribeIn(target);
        const targetIndex = this._tribes.findIndex(t => t.includes(target));
        if (targetTribe.length > 0 && targetIndex >= 0) {
          this.select(targetIndex);
          if ($gameTemp.touchState() === "click") {
            this.processOk();
          }
        }
        $gameTemp.clearTouchState();
      }
    }
  };

  //
  // When one tribe is selected, blink all enemies in the tribe
  //

  const Game_Enemy_isSelected = Game_Enemy.prototype.isSelected;
  Game_Enemy.prototype.isSelected = function() {
    if (Game_Enemy_isSelected.call(this)) {
      return true;
    }
    const action = BattleManager.inputtingAction();
    if (action && action.isForTribe()) {
      const myTribe = $gameTroop.aliveMembersInTribe(this);
      return myTribe.some(enemy => enemy._selected);
    }
    return false;
  };

  //
  // Solve the confliction with MOG_BattleCursor.js
  //
  if ("updateBattleCursorTargetWindow" in Scene_Battle.prototype) {
    const _updateBattleCursorTargetWindow =
      Scene_Battle.prototype.updateBattleCursorTargetWindow;
    Scene_Battle.prototype.updateBattleCursorTargetWindow = function () {
      _updateBattleCursorTargetWindow.call(this);
      if (this._tribeWindow && this._enemyWindow &&
        !this._enemyWindow._bcursor_winVisble
      ) {
        this._tribeWindow.y = this._enemyWindow._bcSo;
      }
    }
  }

})();
