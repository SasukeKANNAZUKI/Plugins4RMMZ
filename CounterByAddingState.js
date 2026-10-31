//=============================================================================
// Plugin for RPG Maker MZ
// CounterByAddingState.js
//=============================================================================
// [Update History]
// 2023.Dec.05 Ver1.0.0 First Release
// 2024.Sep.28 Ver1.1.0 Fix Bug: Skip if the state isn't addable to the target

/*:
 * @target MZ
 * @plugindesc [Ver1.1.0]When one receives melee attack, add specified state to attacker.
 * @author Sasuke KANNAZUKI
 *
 * @param TextWhenInvokeCnt
 * @text Invoke State Counter Text
 * @desc When attacker receive state, show this text to message log. It doesn't display if it's set empty string.
 * @type string
 * @default %1 was waiting for a melee attack!
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MZ.
 *
 * [Summary]
 * This plugin assumes to make a state or battler that adds state to attacker
 * when the battler receives a melee attack.
 *
 * [Definition of Melee Attack]
 * 1.When the skill or item's "Hit Type" is either 'Physical Attack' or
 * 'Certain Hit', it is Melee at default.
 * But subject actor equips missile (ex. arrow, gun), it is Ranged.
 *
 * The weapon is missle when the motion of weapons type is missile in
 * System 2 > [SV]Attack Motions.
 *
 * If the skill or item set Ranged, write its note as follows:
 * <RangeType:Ranged>
 *
 * 2.When the skill or item's "Hit Type" is 'Magical Attack', it's Ranged.
 * If the skill is Melee, write its note as follows:
 * <RangeType:Melee>
 *
 * [How to Set Counter State]
 * To set counter state, describe following to the note of enemy or state (*1):
 * <counterState:4>
 * In this case, It may add state #4 to attacker.
 *
 * It is also able to set plural states as following notation:
 * <counterState:4,1>
 * In this case, check each state whether to addable,
 * and may add first state that can invoke.
 *
 * (*1) It checks also the note of actor, class, weapon, armor.
 *
 * [[Set Chance To Add State]]
 * Generally, state counter invokes every time when it meets condition (*2).
 * If it sets the probability to invoke it, write following tag to the note:
 * <counterRate:66>
 * In the case, state counter will invoke by 66% chance.
 *
 * It's common probability of each counter state.
 *
 * (*2) The probability also consider one's state rate.
 *
 * [[Set Animation When Attacker Receive Counter State]]
 * To display animation when attacker receive counter state,
 * Write following to the note:
 * <counterAnime:59>
 * In this case, it displays animation #59 to the attacker.
 *
 * If the skill or item sets plural counter states,
 * set each animation id as follows:
 * <counterAnime:59,65>
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc [Ver1.1.0]近接攻撃を受けた時、攻撃者に特定のステートを付与
 * @author 神無月サスケ
 *
 * @param TextWhenInvokeCnt
 * @text ステート反撃時テキスト
 * @desc ステート反撃時にバトルログに表示される文。空にすると非表示。%1は攻撃受けた側の名前。
 * @type string
 * @default %1は攻撃を待ち構えていた！
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMZに対応しています。
 *
 * このプラグインは、近接攻撃を受けると、攻撃側に毒や痺れなどのステートを
 * 付与して反撃するような状態の作成を可能にします。
 *
 * ■概要
 * このプラグインは、「さわるとどく」「さわるとまひ」のような、
 * 近接攻撃へのカウンターとしてのステート付与の作成を想定しています。
 *
 * ■近接攻撃の定義
 * そのスキルやアイテムの命中タイプが
 *「物理攻撃」か「必中」の場合、近接攻撃になります。
 * ただし、弓や投石などの飛び道具を装備している場合、非近接攻撃になります。
 *
 * この際、飛び道具かどうかは、システム２の [SV]攻撃モーション にて
 * モーションが「飛び道具」になっているかで判定を行います。
 *
 * それ以外の場合で、非近接攻撃にする場合、
 * スキルやアイテムのメモに以下のように書きます。
 * <RangeType:Ranged>
 *
 * 命中タイプが「魔法攻撃」の場合、非近接攻撃になります。
 * 近接攻撃にする場合、メモに以下のように書きます。
 * <RangeType:Melee>
 *
 * ■ステート反撃の設定方法
 * ステート反撃を有効にするには、ステートや敵キャラのメモ(*1)に
 * 以下のように記述します。
 * <counterState:4>
 * この場合、攻撃者に4番のステートを付与します。
 *
 * 以下のように記述することで、複数のステートの中からひとつを付与できます。
 * <counterState:4,1>
 * 順番に見ていき、最初に発動可能となったステートを付与します。
 *
 * (*1) 他にも、アクター、職業、武器、防具のメモに書いても有効です。
 *
 * ◆付与確率の指定
 * ステート付与確率を％で指定するには、メモに以下のように記述します。
 * <counterRate:50>
 * この場合、ステート反撃は、50％の確率で発動します(*2)。
 * この記述を省略した場合、100％の確率で発動します。
 *
 * 複数の反撃ステートを持つ場合、共通でこの確率になります。
 *
 * (*2) ステート反撃を受けるバトラーの、ステート耐性も考慮されます。
 *
 * ◆付与時のアニメーション設定
 * ステート付与カウンターを受けたバトラーに表示する
 * 戦闘アニメーションを設定できます。
 * <counterAnime:59>
 * この場合、59番のアニメーション(デフォルトでは毒)のアニメが再生されます。
 *
 * 複数のステート付与の場合、同じ順番で記述する必要があります。
 * <counterAnime:59,65>
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'CounterByAddingState';
  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const TextWhenInvokeCnt = parameters['TextWhenInvokeCnt'] || "";

  //
  // check if it can invoke counter to add state
  //
  const isMelee = action => {
    const item = action.item();
    if (!item) {
      return false;
     } else if (!action.isForOpponent()) {
      return false;
    } else if (action.isPhysical() || action.isCertainHit()) {
      if (equipsMissile(action)) {
        return false;
      }
      return item.meta.RangeType !== "Ranged";
    } else {
      return item.meta.RangeType === "Melee";
    }
  };

  const equipsMissile = action => {
    const actorId = action._subjectActorId;
    if (!actorId) {
      return false;
    }
    const weapon = $gameActors.actor(actorId).weapons()[0];
    if (!weapon) {
      return false;
    }
    const motion = $dataSystem.attackMotions[weapon.wtypeId];
    return motion && motion.type === 2;
  };

  const canInvokeStateCnt = (target, action) => {
    return target.isAlive() && target.result().isHit() && isMelee(action);
  };

  //
  // check if the battler has a counter state
  //
  const statesForCnt = battler => {
    let stateInfos = [];
    const objects = battler.traitObjects();
    for (const object of objects) {
      const idToAdd = object.meta.counterState;
      if (idToAdd) {
        const rate = +object.meta.counterRate || 100;
        const newInfos = idToAdd.split(",").map(id => {
          const idRateObj = {};
          idRateObj.id = +id;
          idRateObj.rate = rate;
          return idRateObj;
        });
        setAnimeToCnt(newInfos, object.meta.counterAnime);
        stateInfos = [...stateInfos, ...newInfos];
      }
    }
    stateInfos = stateInfos.filter(info => !!info.id);
    return stateInfos.length ? stateInfos : null;
  };

  const setAnimeToCnt = (infos, animeText) => {
    if (animeText) {
      const animes = animeText.split(",");
      for (let i = 0; i < infos.length; i++) {
        infos[i].animeId = +animes[i] || 0;
      }
    }
  };

  const hasAddableStateCnt = battler => {
    return !!statesForCnt(battler);
  };

  //
  // invoke state counter
  //
  const stateCntToInvoke = (stateInfos, target) => {
    for (const stateInfo of stateInfos) {
      // skip if the state isn't addable to target battler
      if (!target.isStateAddable(stateInfo.id)) {
        continue;
      }
      if (target.stateRate(stateInfo.id) > Math.random() &&
        stateInfo.rate > Math.randomInt(100)
      ) {
        return stateInfo;
      }
    }
    return null;
  };

  const invokeStateCnt = (subject, target) => {
    const stateInfo = stateCntToInvoke(statesForCnt(target), subject);
    if (stateInfo) {
      const logWindow = BattleManager._logWindow;
      logWindow.showCntAnimation(subject, stateInfo.animeId);
      logWindow.push("addCntState", subject, stateInfo.id);
      logWindow.displayCntStates(subject, target, stateInfo.id);
    }
  };

  Window_BattleLog.prototype.addCntState = function(target, stateId) {
    target.addState(stateId);
  };


  Window_BattleLog.prototype.showCntAnimation = function(target, animationId) {
    if (animationId) {
      this.showNormalAnimation ([target], animationId, false);
    }
  };

  // see Window_BattleLog.prototype.displayAddedStates
  Window_BattleLog.prototype.displayCntStates = function(subject, target,
    stateId
  ) {
    const state = $dataStates[stateId];
    const stateText = subject.isActor() ? state.message1 : state.message2;
    if (stateId === subject.deathStateId()) {
      this.push("performCollapse", subject);
    }
    if (stateText) {
      this.push("popBaseLine");
      this.push("pushBaseLine");
      if (TextWhenInvokeCnt) {
        this.push("addText", TextWhenInvokeCnt.format(target.name()));
      }
      this.push("addText", stateText.format(subject.name()));
      this.push("waitForEffect");
    }
  };

  //
  // process state counter
  //

  // see BattleManager.applySubstitute
  const _realTarget = target => {
    if (BattleManager.checkSubstitute(target)) {
      const substitute = target.friendsUnit().substituteBattler();
      if (substitute && target !== substitute) {
          return substitute;
      }
    }
    return target;
  };

  const _BattleManager_invokeNormalAction = BattleManager.invokeNormalAction;
  BattleManager.invokeNormalAction = function(subject, target) {
    _BattleManager_invokeNormalAction.call(this, subject, target);
    const realTarget = _realTarget(target);
    if (canInvokeStateCnt(realTarget, this._action) &&
      hasAddableStateCnt(realTarget)
    ) {
      invokeStateCnt(subject, realTarget);
    }
  };
})();
