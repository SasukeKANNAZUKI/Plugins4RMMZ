//=============================================================================
// Plugin for RPG Maker MV and MZ
// PassiveAutoBuff.js
//=============================================================================
// [Update History]
// 2023/Dec/26 Ver1.0.0 First Release

/*:
 * @target MV MZ
 * @plugindesc Sometimes Add Buff or State Automatically At Specified Timing
 * @author Sasuke KANNAZUKI
 *
 * @param Auto Buff Setting
 * @text Auto Buff Settings
 * @desc
 * @type string
 * @default 
 *
 * @param Buff Message
 * @parent Auto Buff Setting
 * @text Message When Buff Added
 * @desc Text When It Invokes Auto Buff Addition. %1:Battler Name %2:Status Name
 * @type string
 * @default %1’s %2 went up!
 *
 * @param Buff Animation
 * @parent Auto Buff Setting
 * @desc Default Animation That Shows When Auto Buff Is Added.
 * @type animation
 * @default 51
 *
 * @param Auto State Setting
 * @text Auto State Settings
 * @desc 
 * @type string
 * @default 
 *
 * @param State Common Animation
 * @text State Animation
 * @parent Auto State Setting
 * @desc Default Animation That Shows When Auto State Is Added.
 * @type animation
 * @default 51
 *
 * @param State Animation
 * @parent Auto State Setting
 * @text Specified State Animation
 * @desc Special Animations When One Is Affected By Specified State.
 * @type struct<StateAnimation>[]
 * @default []
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MV(Ver1.6.0 or later) and MZ.
 *
 * This plugin enables to invoke buff or state by specified timing and
 * probability  automatically to an battler.
 *
 * [Summary]
 * The timings are at battle starts and turn starts.
 * To set auto invoke buff and state, write following to any trait's(*1) note.
 * (*1) Actor, Class, Weapon, Armor, Enemy and State
 *
 * [Note Descriptions]
 *
 * [[Buff at Starting Battle]]
 * To add buff automatically at starting battle...
 *
 * <AutoBuffStart:[Percentage],[Parameter],[Turns],[Times]>
 *
 * Adds buff specified [Parameter] by [Percentage] chance.
 * [Parameter] It'll explain later how to set.
 * [Percentage] Invocation probability. Set between 0 and 100.
 * [Turn]The duration turn of buff.
 *   (It's omissible. Default value is 5.)
 * [Times] How many times to add the buff.
 *   (It's omissible. Default value is 1.)
 *
 * [[How to set [Parameter]]]
 * Describe  with 3 lowercase letters.
 * mhp:Max HP  mmp:Max MP  atk:Attack  def:Defense
 * mat:M.Attack  mdf:M.Defense  agi:Agility  luk:Luck
 *
 * Examples:
 * <AutoBuffStart:40,def,7,2>
 * At starting battle, by 40% chance, the battler is affected defense buff
 * by 2 times(50%).
 * The buff will lasts 7 turns.
 *
 * <AutoBuffStart:35,mat,4>
 * At starting battle, by 35% chance, the battler's M.Attack receives buff
 * by 1 time(25%, default). The buff will lasts 4 turns.
 *
 * <AutoBuffStart:50,agi>
 * At starting battle, by 50% chance, the battler receives 1 time(25%, default)
 * Agility Buff. The buff will lasts 5(default) turns.
 *
 * [[Buff at Starting Turn]]
 * To add buff automatically at starting turn...
 *
 * <AutoBuffTurn:[Percentage],[Parameter],[Turns],[Times]>
 * Parameters are the same as AutoBuffStart.
 *
 * Examples:
 * <AutoBuffTurn:5,atk,5,4>
 * At starting for each turn, by 5% chance, battler receive buff
 * at most 4 times.
 * This means even if the battler was affected by debuff,
 * the battler's buff level become max(2). The buff will lasts 5 turns.
 * When the buff is expired, the battler become to be not affected 
 * buff or debuff.
 *
 * [[Add State at Starting Battle]]
 * To add state automatically at starting battle...
 * 
 * <AutoStateStart:[Percentage],[State ID]>
 *
 * In this case, it adds battler the state by [percentage]% chance.
 *
 * Example:
 * <AutoStateStart:20,15>
 * On battle starts, add state whose ID is 15 by 20% chance to the battler.
 *
 * [[Add State at Starting Turn]]
 * To add state automatically at starting new turn...
 *
 * <AutoStateTurn:[Percentage],[State ID]>
 *
 * In this case, it adds battler the state by [percentage]% chance.
 *
 * Examples:
 * <AutoStateTurn:2,1>
 * On starting new turn, the battler will die by 2% chance,
   where state ID 1 is death state.
 * It assumes to make cursed equipment or state.
 *
 * <AutoStateTurn:50,10>
 * On starting new turn, by 50% chance, add state whose ID is 10
 * to the battler. If the state 10 is set following...
 * - 'Duration in Turns' is 1
 * - 'Restriction' is 'cannot move'
 * the battler cannot do anyting by 50% chance during the turn.
 * It also assumes to make cursed equipment or state.
 *
 * [Note]
 * When a battler is added a state automatically,
 * it'll display the text that set in database.
 * 'If an actor(enemy) is inflicted with the state' in States.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MV MZ
 * @plugindesc 特定のタイミングで確率で自動的に強化やステート付加が発動
 * @author 神無月サスケ
 *
 * @param Auto Buff Setting
 * @text 自動強化設定
 * @desc 子要素で、自動強化付与の設定を行います。
 * @type string
 * @default 
 *
 * @param Buff Message
 * @parent Auto Buff Setting
 * @text 自動強化時メッセージ
 * @desc %1はバトラー名、%2はステータス名に置き換えられます。
 * @type string
 * @default %1の%2が上がった！
 *
 * @param Buff Animation
 * @parent Auto Buff Setting
 * @text 自動強化時アニメーション
 * @desc 自動強化時、バトラーに表示するアニメーション
 * @type animation
 * @default 51
 *
 * @param Auto State Setting
 * @text 自動ステート付与設定
 * @desc 子要素で、自動ステート付与の設定を行います。
 * @type string
 * @default 
 *
 * @param State Common Animation
 * @parent Auto State Setting
 * @text ステート付与時共通アニメーション
 * @desc 自動ステート付与時、バトラーに表示する共通アニメーション
 * @type animation
 * @default 51
 *
 * @param State Animation
 * @parent Auto State Setting
 * @text ステート付与時アニメーション
 * @desc 自動ステート付与時、バトラーに表示する、ステートIDに応じたアニメーション
 * @type struct<StateAnimationJpn>[]
 * @default []
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMV(Ver1.6.0以降)およびMZに対応しています。
 *
 * このプラグインは、特定のアクターや敵キャラに、
 * 戦闘時の特定のタイミングで、指定された確率で、
 * 自動的に強化やステート付加が発動することを可能にします。
 *
 * ■概要
 * 発動タイミングは、戦闘開始時、ターン開始時を設定可能です。
 * パッシブ強化およびステートの設定には、
 * 特徴を設定する要素(*1)のメモに、後述のように記述します。
 * (*1 アクター、職業、武器、防具、敵キャラ、ステート)
 *
 * ■メモの記述
 * ◆[パラメータ名]について
 * 3文字の小文字アルファベットで指定します。
 * mhp:最大HP mmp:最大MP atk:攻撃力 def:防御力 mat:魔法攻撃力 mdf:魔法防御力
 * agi:敏捷性 luk:運
 *
 * ◆戦闘開始時に確率で強化
 * <AutoBuffStart:[確率％],[パラメータ名],[継続ターン数],[強化回数]>
 * [確率％]の確率で、[パラメータ名]で指定されたパラメータを強化します。
 * [強化回数]で、何段階強化するかを指定します(省略時：1)。
 * [継続ターン数]の間、持続します(省略時：5)。
 *
 * 例：
 * <AutoBuffStart:25,def,7,2>
 * 戦闘開始時、25％の確率で、防御力を2段階(50％)強化します。
 * 強化は7ターン継続します。
 *
 * <AutoBuffStart:35,mat,4>
 * 戦闘開始時、35％の確率で、魔法攻撃力を1段階(25％)強化します。
 * 強化は4ターン継続します。
 *
 * <AutoBuffStart:50,agi>
 * 戦闘開始時、50％の確率で、敏捷性(素早さ)を1段階強化します。
 * 強化は5ターン継続します。
 *
 * ◆ターン開始時ごとに確率で強化
 * <AutoBuffTurn:[確率％],[パラメータ名],[継続ターン数],[強化回数]>
 * 「戦闘開始時に確率で強化」と同様です。
 *
 * 例：
 * <AutoBuffTurn:5,atk,5,4>
 * 各ターン開始時、5％の確率で、攻撃力を最大(+50%)まで強化します(4段階強化)。
 * つまり、弱体がかかっていても相殺し、2段階の強化にします。
 * 強化は5ターン継続し、その後、強化も弱体もない状態に戻ります。
 *
 * ◆戦闘開始時に確率でステート付与
 * <AutoStateStart:[確率％],[ステートID]>
 * [確率％]の確率で、[ステートID]を付与します。
 *
 * 例：
 * <AutoStateStart:20,15>
 * 戦闘開始時、20％の確率で、ID15番のステートを付与します。
 *
 * ◆ターン開始時ごとに確率でステート付与
 * <AutoStateTurn:[確率％],[ステートID]>
 * [確率％]の確率で、[ステートID]を付与します。
 *
 * 例：
 * <AutoStateTurn:2,1>
 * 各ターン開始時に、2％の確率で戦闘不能になります。
 * 呪われた装備などで効果的です。
 * <AutoStateTurn:50,10>
 * 各ターン開始時に、50％の確率で、ID10番のステートが付与されます。
 * このステートが「継続ターン数1、行動制約が『行動できない』」の場合、
 * 2回に1回の割合で、行動不能になります。呪われた装備などで効果的です。
 *
 * ■注意
 * ・ステート付与時のメッセージは、ステートの「アクターがこの状態になった時」の
 * 設定が参照されます。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

/*~struct~StateAnimation:
 *
 * @param State ID
 * @desc State to Set Special Animation
 * @type state
 * @default 0
 *
 * @param Animation ID
 * @desc Animation That Displays When Add The State
 * @type animation
 * @default 0
 *
 */

/*~struct~StateAnimationJpn:
 *
 * @param State ID
 * @text ステート
 * @desc アニメーションを設定するステート
 * @type state
 * @default 0
 *
 * @param Animation ID
 * @text アニメーション
 * @desc 指定のステート付与の際に再生されるアニメーション
 * @type animation
 * @default 0
 *
 */

(() => {
  const pluginName = 'PassiveAutoBuff';

  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const buffMessage = parameters['Buff Message'] || "%1's %2 is reinforced";
  const buffAnimeId = +parameters['Buff Animation'] || 0;
  const stateCommonAnimeId = +parameters['State Common Animation'] || 0;
  const _stateAnimeObj = eval(parameters['State Animation']) || [];
  const stateAnimeObj = _stateAnimeObj.map(line => JsonEx.parse(line));

  const stateAnimeId = stateId => {
    const animeInfo = stateAnimeObj.find(elem => elem["State ID"] == stateId);
    return animeInfo ? +animeInfo["Animation ID"] : stateCommonAnimeId;
  };

  //
  // Apply auto passive buff/state
  //
  const paramToNumber = {mhp:0, mmp:1, atk:2, def:3, mat:4, mdf:5,
    agi:6, luk:7
  };

  const applyAutoBuff = (battler, tagValue) => {
    if (tagValue == null || !battler.isAlive()) {
      return null;
    }
    const operand = tagValue.split(',');
    const paramId = paramToNumber[operand[1]];
    if (paramId == null) {
      return null;
    }
    const turns = +operand[2] || 5;
    const times = +operand[3] || 1;
    if (battler.isMaxBuffAffected(paramId)) {
      // modify turn implicitly
      battler.addBuff(paramId, turns);
      return null;
    }
    for (let i = 0; i < times; i++) {
      battler.addBuff(paramId, turns);
    }
    return paramId;
  };

  const applyAutoState = (battler, tagValue) => {
    if (tagValue == null || !battler.isAlive()) {
      return null;
    }
    const stateId = Number(tagValue.split(',')[1]);
    if (!stateId || !battler.isStateAddable(stateId)) {
      return null;
    }
    if (battler.isStateAffected(stateId)) {
      // modify turn implicitly
      battler.addState(stateId);
      return null;
    }
    battler.addState(stateId);
    return stateId;
  };

  //
  // Determine auto passive effect
  //
  const meetsCondition = tVal => Math.randomInt(100) < parseInt(tVal);

  const autoAddParam = (objects, tagName) => {
    let value = null;
    for (const object of objects) {
      const tagValue = object.meta[tagName];
      if (tagValue && meetsCondition(tagValue)) {
        value = tagValue;
        break;
      }
    }
    return value;
  };

  //
  // process auto passive effect
  //

  const _BattleManager_startBattle = BattleManager.startBattle;
  BattleManager.startBattle = function() {
    _BattleManager_startBattle.call(this);
    processAllAutoEffect("AutoBuffStart", "AutoStateStart", true);
  };

  const _BattleManager_startTurn = BattleManager.startTurn;
  BattleManager.startTurn = function() {
    _BattleManager_startTurn.call(this);
    processAllAutoEffect("AutoBuffTurn", "AutoStateTurn", false);
  };

  const processAllAutoEffect = (buffTag, stateTag, isBattleStart) => {
    let needsWaitFirst = isBattleStart;
    for (const battler of $gameParty.members().concat($gameTroop.members())) {
      processAutoEffect(battler, buffTag, stateTag, needsWaitFirst);
      needsWaitFirst = false;
    }
  };

  const processAutoEffect = (battler, buffTag, stateTag, needsWait1st) => {
    let tagValue = autoAddParam(battler.traitObjects(), buffTag);
    const paramId = applyAutoBuff(battler, tagValue);
    if (paramId) {
      BattleManager._logWindow.displayAutoBuff(battler, paramId, needsWait1st);
      return;
    }
    tagValue = autoAddParam(battler.traitObjects(), stateTag);
    const testBattler = JsonEx.makeDeepCopy(battler);
    const stateId = applyAutoState(testBattler, tagValue);
    if (stateId) {
      BattleManager._logWindow.displayAutoState(battler,stateId, needsWait1st,
        tagValue
      );
    }
  };

  //
  // process battle log
  //

  Window_BattleLog.prototype._longWait = function() {
    this._waitCount = 60;
  };

  Window_BattleLog.prototype.displayAutoBuff = function(battler, paramId,
   needsWairFirst) {
    if (needsWairFirst) {
      this.push('_longWait');
    }
    this.push('pushBaseLine');
    this.push('showAnimation', battler, [battler], buffAnimeId);
    const obj = battler.isActor() ? battler.actor() : battler.enemy();
    const paramName = TextManager.param(paramId);
    this.push('addText', buffMessage.format(obj.name, paramName));
    this.push('_longWait');
    this.push('clear');
    this.push('popBaseLine');
  };

  Window_BattleLog.prototype._longWait = function() {
    this._waitCount = 60;
  };

  Window_BattleLog.prototype._applyAutoState = function(battler, tagValue) {
    applyAutoState(battler, tagValue);
  };

  const isMZ = () => Utils.RPGMAKER_NAME === "MZ";

  Window_BattleLog.prototype.displayAutoState = function(battler, stateId,
   needsWairFirst, tagValue) {
    if (needsWairFirst) {
      this.push('_longWait');
    }
    this.push('pushBaseLine');
    this.push('showAnimation', battler, [battler], stateAnimeId(stateId));
    const obj = battler.isActor() ? battler.actor() : battler.enemy();
    if (isMZ()) {
      this.push('addText', $dataStates[stateId].message1.format(obj.name));
    } else {
      this.push('addText', obj.name + $dataStates[stateId].message1);
    }
    this.push('_longWait');
    this.push('_applyAutoState', battler, tagValue);
    this.push('clear');
    this.push('popBaseLine');
  };

})();
