import styles from "./how-to-use.module.scss";

export function HowToUse() {
	return (
		<div className={styles["how-to-use"]}>
			<section>
				<h1>Prerequisites</h1>
				<ul>
					<p>Qmk compatible keyboard</p>
					<p>Program on host device that will log pressed keys</p>
					<p>
						Image of keyboard layout from{" "}
						<a
							className="span-link"
							href="http://www.keyboard-layout-editor.com"
						>
							KLE
						</a>
					</p>
					<p>Text representation of the matrix positions of your keyboard</p>
				</ul>
				<br />
				<h2>
					Preparing keyboard layout in KLE{" "}
					<span className="subtext">recommended for best looking results</span>
				</h2>

				<p>
					Start by going to{" "}
					<a
						className="span-link"
						href="http://www.keyboard-layout-editor.com"
						target="_blank"
						rel="noreferrer"
					>
						keyboard layout editor
					</a>{" "}
					, load your layout
				</p>
				<p>
					Don&apos;t worry about colors in your layout as you will be able to
					adjust colors used in heatmap later on
				</p>
				<p>
					<span className={styles["important"]}> Now the important bits: </span>
				</p>
				<ul>
					<p>Layout should only have one layer </p>
					<p>
						There&apos should be no white spaces between layout and any of the
						borders of the editor
					</p>
				</ul>
				<p>
					Go to the
					<code>Keyboard properties</code> tab and paste this{" "}
					<code>transparent; border:unset</code> in{" "}
					<code>Case Background:</code> field, it will remove background and
					border from your layout
				</p>
				<p>
					In the end you will end up with something like{" "}
					<a
						className="span-link"
						href="http://www.keyboard-layout-editor.com/#/gists/4e2044c529569548545eb28032b4ac46"
						target="_blank"
						rel="noreferrer"
					>
						this
					</a>
				</p>
			</section>
			<section>
				<h1>
					Get text representation of the matrix positions of your keyboard
				</h1>
				<p>
					Use this command <code>qmk info -kb {`<name>`} -m</code> to obtain
					text representation of the matrix
				</p>
				<br />
				<p>
					Example output of <code>qmk info -kb crkbd -m</code>
				</p>
				<pre>
					<code className={styles["code-multi-line"]}>
						{`Keyboard Name: Corne \nManufacturer: foostan
Website:
Maintainer: QMK Community
Keyboard Folder: crkbd/rev1
Layouts: LAYOUT_split_3x5_3, LAYOUT_split_3x6_3
Processor: atmega32u4
Bootloader: caterina
Layout aliases: LAYOUT=LAYOUT_split_3x6_3
Matrix for "LAYOUT_split_3x6_3":
            ┌──┐                            ┌──┐
┌──┐┌──┐┌──┐│0D│┌──┐┌──┐            ┌──┐┌──┐│4D│┌──┐┌──┐┌──┐
│0A││0B││0C│└──┘│0E││0F│            │4F││4E│└──┘│4C││4B││4A│
└──┘└──┘└──┘┌──┐└──┘└──┘            └──┘└──┘┌──┐└──┘└──┘└──┘
┌──┐┌──┐┌──┐│1D│┌──┐┌──┐            ┌──┐┌──┐│5D│┌──┐┌──┐┌──┐
│1A││1B││1C│└──┘│1E││1F│            │5F││5E│└──┘│5C││5B││5A│
└──┘└──┘└──┘┌──┐└──┘└──┘            └──┘└──┘┌──┐└──┘└──┘└──┘
┌──┐┌──┐┌──┐│2D│┌──┐┌──┐            ┌──┐┌──┐│6D│┌──┐┌──┐┌──┐
│2A││2B││2C│└──┘│2E││2F│            │6F││6E│└──┘│6C││6B││6A│
└──┘└──┘└──┘    └──┘└──┘            └──┘└──┘    └──┘└──┘└──┘
                    ┌──┐    ┌──┐
                    │3F│    │7F│
            ┌──┐┌──┐│  │    │  │┌──┐┌──┐
            │3D││3E││  │    │  ││7E││7D│
            └──┘└──┘└──┘    └──┘└──┘└──┘
Matrix for "LAYOUT_split_3x5_3":
        ┌──┐                            ┌──┐
┌──┐┌──┐│0D│┌──┐┌──┐            ┌──┐┌──┐│4D│┌──┐┌──┐
│0B││0C│└──┘│0E││0F│            │4F││4E│└──┘│4C││4B│
└──┘└──┘┌──┐└──┘└──┘            └──┘└──┘┌──┐└──┘└──┘
┌──┐┌──┐│1D│┌──┐┌──┐            ┌──┐┌──┐│5D│┌──┐┌──┐
│1B││1C│└──┘│1E││1F│            │5F││5E│└──┘│5C││5B│
└──┘└──┘┌──┐└──┘└──┘            └──┘└──┘┌──┐└──┘└──┘
┌──┐┌──┐│2D│┌──┐┌──┐            ┌──┐┌──┐│6D│┌──┐┌──┐
│2B││2C│└──┘│2E││2F│            │6F││6E│└──┘│6C││6B│
└──┘└──┘    └──┘└──┘            └──┘└──┘    └──┘└──┘
                    ┌──┐    ┌──┐
                    │3F│    │7F│
            ┌──┐┌──┐│  │    │  │┌──┐┌──┐
            │3D││3E││  │    │  ││7E││7D│
            └──┘└──┘└──┘    └──┘└──┘└──┘`}
					</code>
				</pre>
				<p>Only copy-paste the lines after “Matrix for …”</p>
			</section>
			<section>
				<h1>Sending key presses from your qmk keyboard to computer</h1>
				<p>
					Go to your qmk keymap folder, open <code> rules.mk</code> and add{" "}
				</p>
				<code className={styles["code-multi-line"]}>
					{" "}
					CONSOLE_ENABLED = yes;
				</code>
				<p className="subtext">
					Console is rather heavy feature, so be prepared to disable other rules
					if you don&apos;t have enough onboard flash, here are some{" "}
					<a
						className="span-link"
						href="https://thomasbaart.nl/2018/12/01/reducing-firmware-size-in-qmk/"
						target="_blank"
						rel="noreferrer"
					>
						{" "}
						tips{" "}
					</a>
					to reduce firmware size
				</p>

				<p>
					Next, open <code>keymap.c</code> and paste this <br />
					<code className={styles["code-multi-line"]}>
						#ifdef CONSOLE_ENABLED <br />
						#include &quot;print.h&quot;
						<br />
						#endif
					</code>
					<br />
					at the top of file
				</p>
				<p>
					Now head to your <code>process_record_user</code> function and write
					the <code>#ifdef</code> code block right after function signature, but
					before the switch statement like so:
				</p>
				<pre>
					<code
						className={styles["code-multi-line"]}
					>{`bool process_record_user(uint16_t keycode, keyrecord_t *record) {

    #ifdef CONSOLE_ENABLE
        uprintf("0x%04X,%u,%u,%u,%b,0x%02X,0x%02X,%u\\n",
              keycode,
              record->event.key.row,
              record->event.key.col,
              get_highest_layer(layer_state),
              record->event.pressed,
              get_mods(),
              get_oneshot_mods(),
              record->tap.count
        );
    #endif
		
    switch (keycode) {
    //...
    }
    return true;
}`}</code>
				</pre>
				<p>
					This will print the hexadecimal representation of every key you press
					as well as its row, column and layer. Make sure to not leave any space
					between the commas and to end the string with a newline{" "}
					<code>\n</code>.
				</p>
				<p>Now you firmware is ready to go, compile and flash it</p>
			</section>
			<section>
				<h1>Computer setup</h1>
				<p>
					To listen to your keyboad, you&apos;ll need to install{" "}
					<a
						className="span-link"
						href="https://www.pjrc.com/teensy/hid_listen.html"
						target="_blank"
						rel="noreferrer"
					>
						hid_listen
					</a>
				</p>
				<p>
					After you&apos;ve downloaded hid_listen, run it in background using
				</p>
				<h2 style={{ margin: 0 }}>Unix</h2>
				<code className={styles["code-multi-line"]}>
					{`sudo ./hid_listen | egrep --line-buffered "(0x[A-F0-9]+,)?[0-9]+,[0-9]+,[0-9]{(1, 2)}" | tee -a keylog.csv`}
				</code>
				<br />
				<h2 style={{ margin: 0 }}>Windows</h2>
				<code className={styles["code-multi-line"]}>
					{`.\\hid_listen.exe | Select-String -Pattern "(0x[A-F0-9]+,)?[0-9]+,[0-9]+,[0-9]{1,2}" | Tee-Object  keylog.csv -Append`}
				</code>
				<br />
				<p>
					You can save this to <code>record_keystrokes.ps1</code> file, then
					create shortcut and put this{" "}
					<code
						className={styles["code-multi-line"]}
					>{`C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -WindowStyle hidden -File "path\\to\\file\\record_keystrokes.ps1"`}</code>{" "}
					in <code>Target</code> property, it will silently start the script
				</p>
				<p>
					After that place newly create shortcut in your autorun folder and you
					are all done
				</p>
			</section>
		</div>
	);
}
