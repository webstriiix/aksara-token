use anchor_lang::prelude::*;

declare_id!("r1Pt7WbfwjZP3URr7FMDTCeh9gchC99oDqHnQoSNX3a");

#[program]
pub mod aksara_token {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
