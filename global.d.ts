// WebGPU Type Declarations
declare global {
  interface Navigator {
    gpu?: GPU;
  }

  interface GPU {
    requestAdapter(options?: GPURequestAdapterOptions): Promise<GPUAdapter | null>;
  }

  interface GPUAdapter {
    info?: GPUAdapterInfo;
    requestDevice(descriptor?: GPUDeviceDescriptor): Promise<GPUDevice>;
  }

  interface GPUAdapterInfo {
    description?: string;
  }

  interface GPUDevice {
    createComputePipeline(descriptor: GPUComputePipelineDescriptor): GPUComputePipeline;
    createBuffer(descriptor: GPUBufferDescriptor): GPUBuffer;
    createShaderModule(descriptor: GPUShaderModuleDescriptor): GPUShaderModule;
    createCommandEncoder(): GPUCommandEncoder;
    queue: GPUQueue;
  }

  interface GPUQueue {
    writeBuffer(buffer: GPUBuffer, bufferOffset: number, data: ArrayBuffer | ArrayBufferView): void;
    submit(commandBuffers: GPUCommandBuffer[]): void;
  }

  interface GPUComputePipeline {
    // Minimal interface for our use case
  }

  interface GPUBuffer {
    getMappedRange(): ArrayBuffer;
    unmap(): void;
    destroy(): void;
  }

  interface GPUShaderModule {
    // Minimal interface
  }

  interface GPUCommandBuffer {
    // Minimal interface
  }

  interface GPUCommandEncoder {
    beginComputePass(): GPUComputePass;
    finish(): GPUCommandBuffer;
  }

  interface GPUComputePass {
    setPipeline(pipeline: GPUComputePipeline): void;
    dispatchWorkgroups(workgroupsX: number): void;
    end(): void;
  }

  interface GPUCanvasContext {
    configure(configuration: GPUCanvasConfiguration): void;
  }

  interface HTMLCanvasElement {
    getContext(contextId: 'webgpu'): GPUCanvasContext | null;
  }

  interface GPUCanvasConfiguration {
    device: GPUDevice;
    format: GPUTextureFormat;
    alphaMode?: 'opaque' | 'premultiplied';
  }

  interface GPURequestAdapterOptions {
    powerPreference?: GPUPowerPreference;
  }

  interface GPUDeviceDescriptor {
    requiredFeatures?: string[];
    requiredLimits?: Record<string, number>;
  }

  interface GPUBufferDescriptor {
    size: number;
    usage: number;
    mappedAtCreation?: boolean;
  }

  interface GPUShaderModuleDescriptor {
    code: string;
  }

  interface GPUComputePipelineDescriptor {
    layout: string;
    compute: {
      module: GPUShaderModule;
      entryPoint: string;
    };
  }

  // Constants
  const GPUBufferUsage: {
    STORAGE: number;
    COPY_DST: number;
    UNIFORM: number;
  };

  type GPUTextureFormat = 'bgra8unorm' | 'rgba8unorm' | 'rgba16float' | 'rgba32float';
  type GPUPowerPreference = 'low-power' | 'high-performance';
}

export {};
