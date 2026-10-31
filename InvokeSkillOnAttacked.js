//=============================================================================
// Plugin for RPG Maker MV and MZ
// InvokeSkillOnAttacked.js
//=============================================================================
// [Update History]
// 2023/Dec/20 Ver1.0.0 First Release
// 2024/Oct/06 Ver1.1.0 Fix Bug: damage display didn't work when plural skills

/*:
 * @target MV MZ
 * @plugindesc [Ver1.1.0]State that invokes specified skill after one is attacked
 * @author Sasuke KANNAZUKI
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MV(Ver1.6.0 or later) and MZ.
 *
 * [Summary]
 * This plugin enables to make states that invoke specified skill
 * when one receives damage.
 *
 * [How To Set Skill]
 * To set a state that invoke skill automatically, write down
 * following notation to the state's note.
 *
 * <SkillOnAttacked:[Skill ID],[Success Percentage]>
 * [Skill ID] ID of the skill that invokes when one receive damage.
 *   It's OK even if the battler doesn't have learned the skill.
 * [Success Percentage] The percentage of invocation. Set between 0 and 100.
 *  This parameter is omissible. Default number is 100.
 *
 * [Notation Examples]
 * When one receives damage...
 *
 * <SkillOnAttacked:10,75>
 * It'll invoke skill whose ID is 10 by 75% chance.
 *
 * <SkillOnAttacked:9>
 * It'll invoke skill whose ID is 9 by 100% chance(default).
 *
 * NOTE: Skills won't invoke when the battler doesn't have enough MP or TP.
 *
 * [Setting Example]
 *
 * [[BLEED State]] : When one receives damage, one also suffer
 *   from additional damage by bleeding.
 * To make the state, it needs to make a new skill whose setting is...
 * - The Scope is User.
 * - The Damage Type is HP Damage.
 * - Message is (The one) "is suffered from addtional damage by bleeding!"
 * And set the skill as an auto invoke one.
 *
 * [[FROZEN State]] : When one receives a damage, one is dead suddenly.
 * Make the following skill and set it as an auto invoke one.
 * - The Scope is User.
 * - Set "Add state 1(death) 100%" to effect list.
 * - Message is (The One) "is shattered and dead!"
 *
 * [[State Of FURY]] : Perform a counterattack to current attacker.
 * Make the following skill and set it as an auto invoke one.
 * - The Scope is "1 Enemy".
 *   Note that in this case, the target enemy is always the attacker.
 * - It's OK to set almost the same as normal attack (skill ID is 1)
 * - Message is (The One) "fought back in anger!"
 *
 * [[State That Sometimes Recover HP]]
 * - Set the skill that recovers HP whose scope is user or 1 ally.
 *   Note that in this case, the targeted ally will always be oneself.
 * - Consider success percentage by yourself.
 *
 * [P.S.]
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MV MZ
 * @plugindesc [Ver1.1.0]攻撃を受けた時に特定のスキルを発動するステート
 * @author 神無月サスケ
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMV(Ver1.6.0以降)およびMZに対応しています。
 *
 * このプラグインは、バトラーが何らかのダメージ攻撃を受けた際、
 * 所定の確率で、スキルを発動するステートを作成可能にします。
 *
 * ■設定方法
 * ステートのメモに、以下の書式で記述します。
 * <SkillOnAttacked:[スキルID],[発動率％]>
 * [スキルID] 発動するスキルID。そのバトラーが覚えていなくても可能です。
 * [発動率％] 発動する確率を％で指定します。省略時は100％になります。
 *
 * ■設定例
 * <SkillOnAttacked:10,75>
 * ダメージを受けた際、75％の確率で、10番のスキルが発動します。
 *
 * <SkillOnAttacked:9>
 * ダメージを受けた際、100％の確率(デフォルト)で、9番のスキルが発動します。
 *
 * 注意：いずれの場合も、MPやTPが不足している場合は発動しません。
 *
 * ■使用例
 *
 * ◆「出血状態」：ダメージを受けるたび、追加で出血状態分のダメージ
 * これを実現するには新たに「自分がダメージを受けるスキル」を作り、
 * ステートのメモにて、そのスキルが発動するように設定します。
 *「範囲」を「使用者」、ダメージタイプを「HPダメージ」にし、
 *「メッセージ」を「は出血で、さらなるダメージ！」などとします。
 *
 * ◆「石化状態」：次にダメージを受けると、石が砕けて即死
 * これも、以下のような新たなスキルを作り、それが発動するようにします。
 *「範囲」を「使用者」に、「使用効果」で「ステート付加」で1番(戦闘不能)に。
 *「メッセージ」は「は砕け散った！」のようにするといいでしょう。
 *
 * ◆「怒り状態」：ダメージを受けると、攻撃してきた相手に反撃
 * これを実現するには、新たに攻撃スキルを作ります。
 * 「範囲」を「敵１体」とした場合、必ず攻撃してきた敵がターゲットになります。
 * そのスキルの「メッセージ」は「の怒りの反撃！」のようにするといいでしょう。
 *
 * ◆「たまに回復状態」：ダメージを受けると、一定確率で回復魔法起動
 *「ヒール」など、「範囲」が「味方１体」または「自分」のスキルを設定します。
 * この場合、回復対象は、必ずダメージを受けたバトラーになります。]
 * 発生率は、その都度調整して下さい。
 *
 * ■その他
 * この書式は、ステート以外の項目のメモに書いても有効です。
 * アクター、職業、敵キャラ、武器、防具でも設定できます。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {

  //
  // gets skill IDs that invokes after one be attacked.
  //
  const afterSkillIdOfObj = obj => {
    const skillText = obj.meta.SkillOnAttacked;
    if (skillText) {
      const skillArray = skillText.split(",");
      const skillId = +skillArray[0];
      if (!skillId || !$dataSkills[skillId]) {
        return 0;
      }
      const rate = +skillArray[1] || 100;
      return Math.randomInt(100) < rate ? skillId : null;
    }
    return 0;
  };

  const afterSkillIds = battler => {
    const skillIds = [];
    for (const obj of battler.traitObjects()) {
      const skillId = afterSkillIdOfObj(obj);
      if (skillId) {
        skillIds.push(skillId);
      }
    }
    return skillIds;
  };

  //
  // invoke specified skill when one is attacked
  //
  const invokeAfterSkill = (subject, target, skillId) => {
    BattleManager._logWindow.push("invokeAfterSkill", subject, target,
      skillId
    );
  };

  const makeTargets = (action, subject, target) => {
    const battler = action.isForFriend() ? target : subject;
    action.setTarget(battler.index());
    return action.makeTargets();
  };

  const paySkillCost = (battler, skillId) => {
    const skill = $dataSkills[skillId];
    if (!skill || !battler.canPaySkillCost(skill)) {
      return false;
    }
    battler.paySkillCost(skill);
    return true;
  };

  Window_BattleLog.prototype._applyAction = function(action, subject) {
    action.apply(subject);
  };

  Window_BattleLog.prototype.displayActionResults2 = function(subject, target
  ) {
    if (target.result().used) {
      this.pushBaseLine();
      this.displayCritical(target);
      this.popupDamage(target);
      this.popupDamage(subject);
      this.displayDamage(target);
      this.displayAffectedStatus(target);
      this.displayFailure(target);
      this.waitForNewLine();
      this.popBaseLine();
    }
  };

  Window_BattleLog.prototype.invokeAfterSkill = function (subject,
    target, skillId
  ) {
    if (!paySkillCost(target, skillId)) {
      return;
    }
    const action = new Game_Action(target);
    action.setSkill(skillId);
    const subjects = makeTargets(action, subject, target);
    this.startAction(target, action, subjects);
    for (subject of subjects) {
      this.push("_applyAction", action, subject);
      this.push("displayActionResults2", target, subject);
      this.push("waitForEffect");
      this.push("wait");
    }
    this.endAction(target);
  };

  //
  // process after skill when one is attacked
  //
  const conditionIsMet = target => {
    const result = target.result();
    if (!result.used || result.missed || result.evaded) {
      return false;
    }
    return target.isAlive() && result.hpAffected && result.hpDamage > 0;
  };

  const _realTarget = target => {
    // see BattleManager.applySubstitute
    if (BattleManager.checkSubstitute(target)) {
      const substitute = target.friendsUnit().substituteBattler();
      if (substitute && target !== substitute) {
        return substitute;
      }
    }
    return target;
  };

  const processAfterSkill = (subject, target) => {
    const realTarget = _realTarget(target);
    if (conditionIsMet(realTarget)) {
      const skillIds = afterSkillIds(realTarget);
      for (skillId of skillIds) {
        invokeAfterSkill(subject, realTarget, skillId);
      }
    }
  };

  const _BattleManager_invokeNormalAction = BattleManager.invokeNormalAction;
  BattleManager.invokeNormalAction = function(subject, target) {
    _BattleManager_invokeNormalAction.call(this, subject, target);
    processAfterSkill(subject, target);
  };

})();
