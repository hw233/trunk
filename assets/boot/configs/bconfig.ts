export function init(data: object) {
    let classes = this;
    for (let e in classes) {
        let i = data[e];
        let o = classes[e];
        if (i && typeof (i) === 'object') {
            o.array = o.array || i.a;
            o.keys = o.keys || i.k;
            o.list = o.list || {};
        }
    }
}


export class ChannelCfg extends iccfg.IChannel {
}

export class HeroCfg extends iccfg.IHero {
	
	get defaultColor(): number {
        let m = iclib.ConfigManager;
        if (m && m['_config']) {
            let r = m.getItemById(m['_config'].Hero_starCfg, this.star_min) as any;
            if (r) {
                return r.color;
            }
        }
        return 1;
    }
    
    get color(): number {
        return this.defaultColor;
    }
	
    get iconPath(): string {
        return `icon/hero/${this.icon}`;
    }
	
	get defaultColorBg(): string {
        return `common/texture/sub_itembg0${this.defaultColor}`;
    }
}

export class ErrorCfg extends iccfg.IError {
}

export class ForbidtipsCfg extends iccfg.IForbidtips {
}

export class Mask_wordCfg extends iccfg.IMask_word {
}

export class Charge_recoupCfg extends iccfg.ICharge_recoup {
}

export class Md5_msgCfg extends iccfg.IMd5_msg {
}
