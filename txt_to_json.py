#!/usr/bin/env python3
# From https://pokemongo.fandom.com/wiki/List_of_Pok%C3%A9mon_by_statistics

import sys
import json
import re

def parse_pokemon_wiki(input_filename, output_filename):
    """
    Reads a wiki-formatted text file and produces a JSON array of objects,
    each with 'name', 'attack', 'defense', and 'stamina'.
    
    Skips entries for Mega Pokémon.
    """

    # Regex to match lines of the form:
    # {{PTS|0003|Venusaur#Mega|ci=Venusaur mega|cl=Mega Venusaur|Grass|Poison|a=241|d=246|s=190}}
    pattern = re.compile(r'\{\{PTS\|(.*?)\}\}')

    pokemons = []

    with open(input_filename, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            
            # Find every match in the line
            matches = pattern.findall(line)
            
            for match in matches:
                # --- Skip lines that contain any form of "mega" ---
                if 'mega' in match.lower():
                    # This entry is for a Mega Pokémon, so we skip it
                    continue

                # Split on '|' to get individual fields
                fields = match.split('|')

                if len(fields) < 2:
                    continue

                # By default, the Pokémon name is in fields[1].
                # However, if we encounter "cl=", we'll override that name.
                canonical_name = None
                attack = None
                defense = None
                stamina = None

                # Look for 'cl=' for an override name, and a=, d=, s=
                for field in fields[2:]:
                    field = field.strip()
                    if field.startswith('cl='):
                        canonical_name = field[3:].strip()
                    elif field.startswith('a='):
                        attack = int(field[2:].strip())
                    elif field.startswith('d='):
                        defense = int(field[2:].strip())
                    elif field.startswith('s='):
                        stamina = int(field[2:].strip())

                # If no "cl=" found, use fields[1]
                if not canonical_name:
                    canonical_name = fields[1].strip()

                # Only add if we have valid Attack, Defense, Stamina
                if attack is not None and defense is not None and stamina is not None:
                    pokemons.append({
                        "name": canonical_name,
                        "attack": attack,
                        "defense": defense,
                        "stamina": stamina
                    })

    # Write JSON to output file
    with open(output_filename, 'w', encoding='utf-8') as out:
        json.dump(pokemons, out, indent=2, ensure_ascii=False)


def main():
    """
    Usage: python parse_wiki.py <input_file> <output_file>
    """
    if len(sys.argv) != 3:
        print("Usage: python parse_wiki.py <input_file> <output_file>")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]

    parse_pokemon_wiki(input_file, output_file)
    print(f"JSON file successfully written to {output_file}.")

if __name__ == "__main__":
    main()
