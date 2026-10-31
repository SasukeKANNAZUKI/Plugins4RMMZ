//=============================================================================
// Plugin for RPG Maker MV and MZ
// AttackGuaranteed.js
//=============================================================================
/*:
 * @target MV MZ
 * @plugindesc Always enables to attack command even if one can't pay the cost.
 * @author Sasuke KANNAZUKI
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MV and MZ.
 * This plugin disables to forbid to select normal battle.
 *
 * [Summary]
 * Generally, skill id for normal attack is able to change for each weapon.
 * (MV: it enables by introducing the plugin 'WeaponSkill.js'.
 *  MZ: It is able to from database. Traits -> Attack -> Attack Skill.)
 * This means you can make attack skill MP consume or requires any cost.
 *
 * At default, one cannot select Attack when one cannot pay the cost.
 * (ex. attack skill's MP cost is larger than one's current MP)
 *
 * This plugin enable attack command selectable even if one can't pay the cost.
 *
 * [Trivia]
 * This plugin realizes the same speification as RPG Maker 2000.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MV MZ
 * @plugindesc 仮にコスト不足であっても、常に通常攻撃を可能にします
 * @author 神無月サスケ
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMVおよびMZに対応しています。
 * このプラグインは、通常攻撃を常に、仮にコスト不足でも選択可能にします。
 *
 * ■概要
 * 一般的に、通常攻撃の際のスキルIDは、武器ごとに変更可能です。
 * (MZ では、特徴 → 攻撃 → 攻撃スキル で変更可能です。
 *  MV では、WeaponSkill.js を導入することで可能になります。)
 * これにより、攻撃の際にMPなどのリソースを消費する武器が作成可能です。
 *
 * しかしこの場合、アクターのMPが通常攻撃の消費MPより少ない場合、
 * 通常攻撃が選択できなくなっていました。
 *
 * このプラグインを導入することで、仮に前述のようなコスト不足の場合でも
 * 通常攻撃が常に選択可能になります。
 *
 * ■補足
 * このプラグインの仕様は、RPGツクール2000で採用されていました。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(function() {

  // ignore MP,TP and any other costs
  Game_Actor.prototype.canAttack = function() {
    return !!$dataSkills[this.attackSkillId()];
  };

  const _Game_Actor_canPaySkillCost = Game_Actor.prototype.canPaySkillCost;
  Game_Actor.prototype.canPaySkillCost = function(skill) {
    if (_Game_Actor_canPaySkillCost.call(this, skill)) {
      return true;
    } else if (skill.id === this.attackSkillId()) {
      return true;
    }
    return false;
  };

  const _Game_Actor_paySkillCost = Game_Actor.prototype.paySkillCost;
  Game_Actor.prototype.paySkillCost = function(skill) {
    _Game_Actor_paySkillCost.call(this, skill);
    this._mp = Math.max(this._mp, 0);
    this._tp = Math.max(this._tp, 0);
  };

})();
