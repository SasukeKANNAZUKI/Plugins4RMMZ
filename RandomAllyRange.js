//=============================================================================
// Plugin for RPG Maker MV and MZ
// RandomAllyRange.js
//=============================================================================
/*:
 * @target MV MZ
 * @plugindesc Enables to make item/skill whose scope is random ally
 * @author Sasuke KANNAZUKI
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MV(Ver1.6.0 or later) and MZ.
 * This plugin enables to make item/skill whose scope is random ally.
 *
 * [Summary]
 * To change scope of an item/skill, write down its note following style.
 * <randomAlly:0> selected from Alive ally
 * <randomAlly:1>  selected from Dead ally
 * <randomAlly:2> selected from Unconditional ally
 *
 * [NOTE]
 * Those new ranges select an ally completely random, never consider
 * it's appropriate or not.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MV MZ
 * @plugindesc 対象をランダムな仲間1体にするスキルやアイテムが作成可能
 * @author 神無月サスケ
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMV(Ver1.6.0以降)およびMZに対応しています。
 * このプラグインは、対象をランダムな仲間1体にするスキルやアイテムを
 * 作成可能にします。
 *
 * ■概要
 * 範囲を仲間1体ランダムにするには、スキル/アイテムのメモに
 * 以下のように記述します。
 * <randomAlly:0> 生存している仲間対象
 * <randomAlly:1> 戦闘不能の仲間対象
 * <randomAlly:2> 全仲間対象
 *
 * ■注意
 * 仲間は完全にランダムに選ばれます。そのスキルやアイテムが相応しいかどうかは
 * 一切考慮されません。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  //
  // define constant value
  //

  // [NOTE] The value 40~42 is selected random. So it means nothing.
  // if the value conflicts with another plugin, change the value.
  //
  // RAT stands for Random (living) Ally Target
  const RAT = 40;
  // RDAT stands for Random Dead Ally Target
  const RDAT = 41;
  // RAAT stands for Random Any-condition Ally Target
  const RAAT = 42;

  //
  // For efficiency, process note at first
  //
  const _Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function() {
    _Scene_Boot_start.call(this);
    processItemScope();
  };

  const processItemScope = () => {
    for (const item of [...$dataSkills, ...$dataItems]) {
      if (item && item.name && item.meta.randomAlly) {
        item.scope = randomAllyScope(item.meta.randomAlly);
      }
    }
  };

  const randomAllyScope = scope => {
    switch (+scope) {
    case 0:
      return RAT;
    case 1:
      return RDAT;
    case 2:
      return RAAT;
    default: // true
      return RAT;
    }
  };

  //
  // Extend Scopes
  //

  const _Game_Action_isForFriend = Game_Action.prototype.isForFriend;
  Game_Action.prototype.isForFriend = function() {
    const result = this.checkItemScope([RAT, RDAT, RAAT]);
    return result || _Game_Action_isForFriend.call(this);
  };

  if (Game_Action.prototype.isForAliveFriend) { //MZ
    const _Game_Action_isForAliveFriend =
      Game_Action.prototype.isForAliveFriend;
    Game_Action.prototype.isForAliveFriend = function() {
      const result = this.checkItemScope([RAT]);
      return result || _Game_Action_isForAliveFriend.call(this);
    };
  };

  const _Game_Action_isForDeadFriend = Game_Action.prototype.isForDeadFriend;
  Game_Action.prototype.isForDeadFriend = function() {
    const result = this.checkItemScope([RDAT]);
    return result || _Game_Action_isForDeadFriend.call(this);
  };

  const _Game_Action_isForOne = Game_Action.prototype.isForOne;
  Game_Action.prototype.isForOne = function() {
    const result = this.checkItemScope([RAT, RDAT, RAAT]);
    return result || _Game_Action_isForOne.call(this);
  };

  const _Game_Action_isForRandom = Game_Action.prototype.isForRandom;
  Game_Action.prototype.isForRandom = function() {
    const result = this.checkItemScope([RAT, RDAT, RAAT]);
    return result || _Game_Action_isForRandom.call(this);
  };

  const _Game_Action_numTargets = Game_Action.prototype.numTargets;
  Game_Action.prototype.numTargets = function() {
    if (this.checkItemScope([RAT, RDAT, RAAT])) {
      return 1;
    }
    return _Game_Action_numTargets.call(this);
  };

  //
  // perform random ally selection
  //
  Game_Unit.prototype.randomAllTarget = function() {
    let tgrRand = Math.random() * this.tgrSum();
    let target = null;
    for (const member of this.allMembers()) {
      tgrRand -= member.tgr;
      if (tgrRand <= 0 && !target) {
        target = member;
      }
    }
    return target;
  };

  const _Game_Action_targetsForFriends =
    Game_Action.prototype.targetsForFriends;
  Game_Action.prototype.targetsForFriends = function() {
    if (this.isForRandom()) {
      const unit = this.friendsUnit();
      if (this.checkItemScope([RAAT])) {
        const target = unit.randomAllTarget();
        if (target && target.isDead()) {
          target.removeState(target.deathStateId());
          target.revive();
        }
        return [target];
      } else if (this.isForFriend() && !this.isForDeadFriend()) {
        return [unit.randomTarget()];
      } else if (this.isForDeadFriend()) {
        const target = unit.randomDeadTarget();
        return target ? [unit.randomDeadTarget()] : [];
      } else {
        return [unit.randomAllTarget()];
      }
    }
    return _Game_Action_targetsForFriends.call(this);
  };

})();
