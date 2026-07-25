'use client'

export default function BackgroundSurface() {
    // grid geometry: 1cm squares at 28px, major square every 5 (140px)
    const minor = 28
    const majorStep = minor * 5
    const rulerLen = minor * 40

    // ruler ticks + numerals, built once, reused (rotated) for the vertical edge
    const ticks = []
    for (let x = 0; x <= rulerLen; x += minor) {
        const isMajor = x % majorStep === 0
        ticks.push(
            `<line x1="${x}" y1="6" x2="${x}" y2="${isMajor ? 20 : 12}" stroke="rgba(34,211,238,0.16)" stroke-width="${isMajor ? 1.2 : 0.7}"/>`
        )
    }
    const labels = []
    for (let x = majorStep; x <= rulerLen; x += majorStep) {
        labels.push(
            `<text x="${x + 3}" y="33" font-size="10" font-family="monospace" fill="rgba(34,211,238,0.22)">${x / minor}</text>`
        )
    }
    const rulerSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='${rulerLen}' height='40'><line x1='0' y1='6' x2='${rulerLen}' y2='6' stroke='rgba(34,211,238,0.14)' stroke-width='1'/>${ticks.join('')}${labels.join('')}</svg>`
    const rulerUrl = `url("data:image/svg+xml,${encodeURIComponent(rulerSvg)}")`

    // 45deg / 60deg angle guides radiating from the lower-left origin, faint cyan
    const angleSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='900' height='900'><line x1='0' y1='900' x2='900' y2='0' stroke='rgba(34,211,238,0.10)' stroke-width='1'/><line x1='0' y1='900' x2='450' y2='0' stroke='rgba(34,211,238,0.08)' stroke-width='1'/><line x1='0' y1='450' x2='900' y2='450' stroke='rgba(34,211,238,0.06)' stroke-width='1'/></svg>`
    const angleUrl = `url("data:image/svg+xml,${encodeURIComponent(angleSvg)}")`

    // sparse, asymmetric healed knife cuts -- barely-there straight scores, random angles
    const cutsSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='900'><g stroke='rgba(255,255,255,0.075)' stroke-width='1' stroke-linecap='round'><line x1='210' y1='140' x2='258' y2='121'/><line x1='980' y1='90' x2='1010' y2='150'/><line x1='140' y1='560' x2='120' y2='612'/><line x1='700' y1='430' x2='760' y2='448'/><line x1='1180' y1='620' x2='1150' y2='670'/><line x1='430' y1='700' x2='470' y2='686'/><line x1='1340' y1='300' x2='1372' y2='340'/></g></svg>`
    const cutsUrl = `url("data:image/svg+xml,${encodeURIComponent(cutsSvg)}")`

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ backgroundColor: '#101216' }}>

            {/* Everything printed on the mat drifts together with the carousel.
                Widened either side so the drift never exposes an edge. */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: -80, right: -80, transform: 'translate3d(var(--bg-shift), 0, 0)' }}>
            {/* mat base -- deep green cutting-mat body */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #16211c 0%, #1e2b24 48%, #16211c 100%)' }} />

            {/* mottling -- uneven, used surface, irregular soft patches */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse 620px 420px at 18% 28%, rgba(42,59,49,0.30), transparent 70%), radial-gradient(ellipse 520px 700px at 82% 58%, rgba(42,59,49,0.22), transparent 72%), radial-gradient(ellipse 760px 480px at 46% 88%, rgba(14,20,17,0.35), transparent 70%)' }} />

            {/* minor grid -- 1cm squares */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(to right, rgba(255,255,255,0.055) 0px, rgba(255,255,255,0.055) 1px, transparent 1px, transparent ${minor}px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.055) 0px, rgba(255,255,255,0.055) 1px, transparent 1px, transparent ${minor}px)` }} />

            {/* major grid -- every 5th square, heavier line */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(to right, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 1.5px, transparent 1.5px, transparent ${majorStep}px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 1.5px, transparent 1.5px, transparent ${majorStep}px)` }} />

            {/* angle guides -- 45deg / 60deg printed lines from lower-left origin */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: angleUrl, backgroundSize: '900px 900px', backgroundPosition: 'left bottom', backgroundRepeat: 'no-repeat' }} />

            {/* ruler -- bottom edge, held inboard so it never collides with the fixed UI measurement bar */}
            <div style={{ position: 'absolute', left: 24, right: 24, bottom: 148, height: 40, backgroundImage: rulerUrl, backgroundRepeat: 'repeat-x', backgroundPosition: 'left top' }} />

            {/* ruler -- left edge, rotated copy, also held inboard */}
            <div style={{ position: 'absolute', top: 24, left: 188, width: rulerLen, height: 40, transform: 'rotate(-90deg)', transformOrigin: 'top left', backgroundImage: rulerUrl, backgroundRepeat: 'repeat-x', backgroundPosition: 'left top' }} />

            {/* registration cross -- centred */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 36, height: 1, transform: 'translate(-50%, -50%)', background: 'rgba(34,211,238,0.14)' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 1, height: 36, transform: 'translate(-50%, -50%)', background: 'rgba(34,211,238,0.14)' }} />

            {/* healed cuts -- faint scored lines proving this is a used, physical mat */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: cutsUrl, backgroundSize: '1600px 900px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
            </div>

            {/* key light -- off-centre soft pool as if lit from above */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse 900px 700px at 66% 36%, rgba(255,250,240,0.05), transparent 70%)' }} />

            {/* vignette -- dark room falloff toward the edges */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse 120% 100% at 50% 48%, transparent 42%, rgba(6,9,7,0.62) 100%)' }} />

            {/* scrim -- keep the top UI zone very dark */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 160, background: 'linear-gradient(to bottom, rgba(6,8,7,0.88) 0px, rgba(6,8,7,0.6) 100px, transparent 160px)' }} />

            {/* scrim -- keep the bottom UI zone very dark, absorbs the mat's own ruler edge */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 190, background: 'linear-gradient(to top, rgba(6,8,7,0.9) 0px, rgba(6,8,7,0.62) 130px, transparent 190px)' }} />

        </div>
    )
}
