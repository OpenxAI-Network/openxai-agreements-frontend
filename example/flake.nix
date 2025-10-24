{
  inputs = {
    xnode-manager.url = "github:Openmesh-Network/xnode-manager";
    openxai-signables.url = "github:Openmesh-Network/openxai-signables"; # "path:..";
    nixpkgs.follows = "openxai-signables/nixpkgs";
  };

  outputs = inputs: {
    nixosConfigurations.container = inputs.nixpkgs.lib.nixosSystem {
      specialArgs = {
        inherit inputs;
      };
      modules = [
        inputs.xnode-manager.nixosModules.container
        {
          services.xnode-container.xnode-config = {
            host-platform = ./xnode-config/host-platform;
            state-version = ./xnode-config/state-version;
            hostname = ./xnode-config/hostname;
          };
        }
        inputs.openxai-signables.nixosModules.default
        {
          services.openxai-signables.enable = true;
        }
      ];
    };
  };
}
