/*:
* @target MZ
* @plugindesc (実験用)強化有効度の設定
*
* @command buffRate
* @text 強化有効度の設定
* @desc 強化の成功率を設定します。
*
* @arg target
* @text 対象アクター
* @desc 強化有効度を変更するアクターです。0のときは何もしません。
* @type actor
* @default 0
*
* @arg targetState
* @text 対象ステート
* @desc 強化有効度を変更するステートです。0のときは何もしません。
* @type state
* @default 0
*
* @arg param
* @text パラメータ
* @desc 強化有効度％を変更するパラメータです
* @type select
* @option 最大HP
* @value 0
* @option 最大MP
* @value 1
* @option 攻撃力
* @value 2
* @option 防御力
* @value 3
* @option 魔法力
* @value 4
* @option 魔法防御
* @value 5
* @option 敏捷性
* @value 6
* @option 運
* @value 7
* @default 0
*
* @arg rate
* @text 変更倍率％
* @desc 強化有効度の値を％で設定します
* @type number
* @min 0
* @default 100

* @command resetBuffRate
* @text 強化有効度のリセット
* @desc 強化の成功率を100％に戻します。
*
* @arg target
* @text 対象アクター
* @desc 強化有効度をリセットするアクターです。
* @type actor
* @default 1
*
* @arg param
* @text パラメータ
* @desc 強化有効度をリセットするパラメータです
* @type select
* @option 最大HP
* @value 0
* @option 最大MP
* @value 1
* @option 攻撃力
* @value 2
* @option 防御力
* @value 3
* @option 魔法力
* @value 4
* @option 魔法防御
* @value 5
* @option 敏捷性
* @value 6
* @option 運
* @value 7
* @default 0
*
* @help
* このプラグインでは、プラグインコマンドで以下のことが可能です。
* - アクターまたはステートの強化有効度のセット
*   重複してセットすると、それだけ掛け合わせた値になります。
* - アクターのステート強化有効度リセット
*   リセットを行うと初期値の100%になります。
*
* テスト用に作られたものなので、アクターとステート以外には設定できません。
*
* [ライセンス]
* テスト用に作ったものなので、転載禁止です。
* 常識の範疇で自由に使っていただいてかまいませんが、あくまでテスト用です。
*/

(() => {
  const pluginName = 'S_Status_Buff_MZ';
  //
  // define buff rate
  //
  Game_BattlerBase.TRAIT_BUFF_RATE = 103;

  Game_BattlerBase.prototype.buffRate = function(paramId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_BUFF_RATE, paramId);
  };

  const _Game_Action_itemEffectAddBuff =
    Game_Action.prototype.itemEffectAddBuff;
  Game_Action.prototype.itemEffectAddBuff = function(target, effect) {
    let chance = target.buffRate(effect.dataId) * this.lukEffectRate(target);
    if (Math.random() < chance) {
      _Game_Action_itemEffectAddBuff.call(this, target, effect);
    }
  };

  //
  // proces plugin command
  //
  const addBuffRate = (target, args) => {
    if (target) {
      target.traits.push({code:103, dataId:+args.param,
        value:+args.rate / 100.0}
      );
    }
  };

  PluginManager.registerCommand(pluginName, 'buffRate', args => {
    let target = $gameActors.actor(+args.target);
    addBuffRate(target.actor(), args);
    target = $dataStates[+args.targetState];
    addBuffRate(target, args);
  });

  PluginManager.registerCommand(pluginName, 'resetBuffRate', args => {
    const target = $gameActors.actor(+args.target);
    if (target) {
      const dataTarget = target.actor();
      let traits = dataTarget.traits;
      traits = traits.filter(trait => trait.code !== 103);
      dataTarget.traits = traits;
    }
  });
})();
