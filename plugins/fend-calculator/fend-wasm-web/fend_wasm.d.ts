/* tslint:disable */
/* eslint-disable */

/** Initialise currency data. The provided `currencyData` map should contain
 * currency names mapped to their relative values.
 *
 * For example:
 * ```typescript
 * const currencyData = new Map();
 * currencyData.set('USD', 1);
 * currencyData.set('EUR', 0.9);
 * initialiseWithHandlers(currencyData);
 * ``` */
export function initialiseWithHandlers(currencyData: Map<string, number>): void;



export function evaluateFendWithTimeout(input: string, timeout: number): string;

/**
 * Takes a '\0'-separated string of inputs, and returns a '\0'-separated string of results
 */
export function evaluateFendWithTimeoutMultiple(inputs: string, timeout: number): string;

export function evaluateFendWithVariablesJson(input: string, timeout: number, variables: string): string;

export function substituteInlineFendExpressions(input: string, timeout: number): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly evaluateFendWithTimeout: (a: number, b: number, c: number, d: number) => void;
    readonly evaluateFendWithTimeoutMultiple: (a: number, b: number, c: number, d: number) => void;
    readonly evaluateFendWithVariablesJson: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly evaluate_fend_with_timeout: (a: number, b: number, c: number, d: number) => void;
    readonly initialiseWithHandlers: (a: number) => void;
    readonly substituteInlineFendExpressions: (a: number, b: number, c: number, d: number) => void;
    readonly __wasm_bindgen_func_elem_2377: (a: number, b: number, c: number, d: number) => void;
    readonly __wbindgen_export: (a: number, b: number) => number;
    readonly __wbindgen_export2: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_export3: (a: number) => void;
    readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
    readonly __wbindgen_export4: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
