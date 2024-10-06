import React from "react";
import { Circle } from "lucide-react";

const IndicatorLight = ({ active }) => (
  <Circle
    className={`inline-block mr-2 ${
      active ? "text-green-400" : "text-gray-600"
    }`}
  />
);

const Gauge = ({
  value,
  max,
  label,
}) => (
  <div className="flex flex-col items-center">
    <div className="w-full bg-stone-900 rounded-full h-2.5">
      <div
        className="bg-neutral-800 h-2.5 rounded-full"
        style={{ width: `${(value / max) * 100}%` }}
      ></div>
    </div>
    <span className="text-green-400 text-xs mt-1">{label}</span>
  </div>
);

export default function Dashboard() {
  return (
    <div className="bg-stone-900 text-white p-6 font-mono">
      <div className="border-2 bg-neutral-800 p-2">
        <div className="bg-stone-900 px-2 border mb-2">
          <p className="text-green-400">FEED</p>
          <h1 className="text-4xl font-extrabold mb-2 text-white">
            LIFE SUPPORT OVERVIEW
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 ">
          <div className="border bg-stone-900 p-2 ">
            <h2 className="text-green-400 ">PRESSURE</h2>
            <div className="text-4xl ">
              15.5 <span className="text-sm">PSI</span>
            </div>
            <div className="text-xs text-green-400">STABLE</div>
          </div>

          <div className="border bg-stone-900 p-2 ">
            <h2 className="text-green-400 ">HUMIDITY</h2>
            <div className="text-4xl ">
              55 <span className="text-sm">%</span>
            </div>
            <div className="text-xs text-green-400">+0.33%/min</div>
          </div>

          <div className="border bg-stone-900 p-2">
            <h2 className="text-green-400 ">CONSUMABLES</h2>
            <div className="flex justify-between">
              <Gauge value={100} max={100} label="O2 RESERVES" />
              <Gauge value={82} max={100} label="O2 TRUNK" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
          <div className="border bg-stone-900 p-2">
            <h2 className="text-green-400 ">O2 LEVELS</h2>
            <div className="text-4xl ">
              20.2 <span className="text-sm">%</span>
            </div>
            <div className="text-xs text-green-400">STABLE</div>
          </div>

          <div className="border bg-stone-900 p-2">
            <h2 className="text-green-400 ">TOXIC LEVELS</h2>
            <div className="text-sm">
              <div>CO: 4%</div>
              <div>HCN: 3%</div>
              <div>HCL: 0%</div>
            </div>
            <div className="text-xs text-green-400 mt-2">STABLE</div>
          </div>

          <div className="border bg-stone-900 p-2">
            <h2 className="text-green-400 ">VALVES</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <IndicatorLight active={true} />
                AVO-A
              </div>
              <div>
                <IndicatorLight active={false} />
                DHC.CV
              </div>
              <div>
                <IndicatorLight active={true} />
                AVO-B
              </div>
              <div>
                <IndicatorLight active={false} />
                DHC.PT
              </div>
              <div>
                <IndicatorLight active={false} />
                DHA.DV.VAC
              </div>
              <div>
                <IndicatorLight active={true} />
                DHC.PT 3
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 border bg-stone-900 p-2">
          <h2 className="text-green-400 ">SMOKE DETECTORS</h2>
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="text-green-400 text-sm">
                <IndicatorLight active={true} />
                NOMINAL
              </div>
            ))}
          </div>
        </div>

        <div className="bg-stone-900 px-2 border mb-2 mt-2">
          <p className="text-green-400">FEED</p>
          <h1 className="text-4xl font-extrabold mb-2 text-white">
            ALL SYSTEMS
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="border bg-stone-900 p-2">
            <h2 className="text-green-400 ">TEMPERATURE</h2>
            <div className="text-4xl ">
              70.0 <span className="text-sm">F</span>
            </div>
            <div className="text-xs text-green-400">STABLE</div>
          </div>

          <div className="border bg-stone-900 p-2">
            <h2 className="text-green-400 ">CO2 LEVELS</h2>
            <div className="text-4xl ">
              0.14 <span className="text-sm">%</span>
            </div>
            <div className="text-xs text-green-400">STABLE</div>
          </div>

          <div className="border bg-stone-900 p-2">
            <h2 className="text-green-400 ">O2 TRUNK</h2>
            <div className="text-4xl ">
              87 <span className="text-sm">%</span>
            </div>
            <div className="text-xs text-green-400">STABLE</div>
          </div>

          <div className="border bg-stone-900 p-2">
            <h2 className="text-green-400 ">MAIN T</h2>
            <Gauge value={50} max={100} label="OXYGEN" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <div className="border bg-stone-900 p-2">
            <h2 className="text-green-400 ">COMMUNICATIONS</h2>
            <div className="text-sm">
              <div>
                <IndicatorLight active={true} />
                PT SHUTTLE
              </div>
              <div>
                <IndicatorLight active={true} />
                CT SHUTTLE
              </div>
              <div>
                <IndicatorLight active={true} />
                VT SHUTTLE
              </div>
            </div>
          </div>

          <div className="border bg-stone-900 p-2">
            <h2 className="text-green-400 ">NITROX RESERVES</h2>
            <Gauge value={79} max={100} label="79%" />
            <div className="text-xs text-green-400 mt-2">
              PERIGEE RAISE PLAN
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
          <div className="border bg-stone-900 p-2 flex justify-between items-center">
            <div className="w-1/4 bg-green-400 h-16"></div>
            <div className="w-1/4 bg-green-700 h-16"></div>
            <div className="text-sm">
              <div>LP</div>
              <div>HP</div>
            </div>
          </div>

          <div className="border bg-stone-900 p-2">
            <h2 className="text-green-400 ">GS.01</h2>
            {/* Placeholder for graph */}
            <div className="h-16 bg-neutral-800"></div>
          </div>

          <div className="border bg-stone-900 p-2 flex justify-between items-center">
            <div className="w-1/4 bg-green-400 h-16"></div>
            <div className="w-1/4 bg-green-700 h-16"></div>
            <div className="text-sm">
              <div>LP</div>
              <div>HP</div>
            </div>
          </div>
        </div>

        <div className="mt-2 border bg-stone-900 p-2">
          <h2 className="text-green-400 ">LOG ACTIVITY</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div>
              <IndicatorLight active={true} />
              SECURE VAL.
            </div>
            <div>
              <IndicatorLight active={true} />
              DOORS PASS
            </div>
            <div>
              <IndicatorLight active={true} />
              LOCK DEPT.
            </div>
            <div>
              <IndicatorLight active={true} />
              CABIN PRES.
            </div>
            <div>
              <IndicatorLight active={false} />
              SUITS
            </div>
            <div>
              <IndicatorLight active={true} />
              COMMS. 01
            </div>
            <div>
              <IndicatorLight active={false} />
              COMMS. 02
            </div>
            <div>
              <IndicatorLight active={true} />
              INT. COOLER
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
